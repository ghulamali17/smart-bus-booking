import { prisma } from '../../db.js';

// Get bookings (filtered by user or all if admin)
export async function getBookings(req, res) {
  try {
    const user = req.user;
    let bookings;
    if (user && user.role === 'admin') {
      bookings = await prisma.booking.findMany({
        orderBy: { created_at: 'desc' },
      });
    } else if (user && user.id) {
      bookings = await prisma.booking.findMany({
        where: {
          OR: [
            { user_id: user.id },
            { user_email: user.email },
          ],
        },
        orderBy: { created_at: 'desc' },
      });
    } else {
      bookings = await prisma.booking.findMany({
        orderBy: { created_at: 'desc' },
      });
    }
    return res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return res.status(500).json({ error: 'Database error fetching bookings' });
  }
}

// Book a ticket (Atomic transaction with seat reduction)
export async function bookTicket(req, res) {
  const { passengerName, passengerAge, routeId, seats } = req.body;
  const user = req.user;

  if (!passengerName || !passengerName.trim()) {
    return res.status(400).json({ error: 'Passenger name is required and cannot be blank.' });
  }

  const ageNum = parseInt(passengerAge, 10);
  if (isNaN(ageNum) || ageNum <= 0) {
    return res.status(400).json({ error: 'Age must be a positive integer greater than zero.' });
  }

  const seatsNum = parseInt(seats, 10);
  if (isNaN(seatsNum) || seatsNum <= 0) {
    return res.status(400).json({ error: 'Seat quantity must be a positive integer.' });
  }

  const now = new Date();
  const formattedTimestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const route = await tx.route.findUnique({
        where: { route_id: routeId.toUpperCase() },
      });

      if (!route) {
        const err = new Error(`Route '${routeId}' does not exist.`);
        err.status = 404;
        throw err;
      }

      if (seatsNum > route.available_seats) {
        const err = new Error(`Cannot book ${seatsNum} seats! Only ${route.available_seats} seat(s) available on ${route.route_id}.`);
        err.status = 400;
        throw err;
      }

      const count = await tx.booking.count();
      const bookingId = `B${1001 + count}`;
      const totalFare = route.ticket_price * seatsNum;

      if (user && user.id) {
        const dbUser = await tx.user.findUnique({ where: { id: user.id } });
        if (dbUser && dbUser.balance < totalFare) {
          const err = new Error(`Insufficient wallet balance (Rs. ${dbUser.balance.toLocaleString()}). Ticket fare is Rs. ${totalFare.toLocaleString()}.`);
          err.status = 400;
          throw err;
        }
        if (dbUser) {
          await tx.user.update({
            where: { id: user.id },
            data: { balance: { decrement: totalFare } },
          });
        }
      }

      await tx.route.update({
        where: { route_id: route.route_id },
        data: { available_seats: route.available_seats - seatsNum },
      });

      const newBooking = await tx.booking.create({
        data: {
          booking_id: bookingId,
          user_id: user ? user.id : null,
          user_email: user ? user.email : null,
          passenger_name: passengerName.trim(),
          passenger_age: ageNum,
          route_id: route.route_id,
          seats: seatsNum,
          total_fare: totalFare,
          status: 'Confirmed',
          timestamp: formattedTimestamp,
        },
      });

      return newBooking;
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error('Prisma booking transaction error:', err.message);
    return res.status(err.status || 500).json({ error: err.message || 'Database transaction failed' });
  }
}

// Cancel a booking (Atomic transaction with seat restoration)
export async function cancelBooking(req, res) {
  const bookingId = req.params.id.toUpperCase();
  const user = req.user;

  try {
    const updatedBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { booking_id: bookingId },
      });

      if (!booking) {
        const err = new Error(`Booking '${bookingId}' not found.`);
        err.status = 404;
        throw err;
      }

      if (user && user.role !== 'admin' && booking.user_id && booking.user_id !== user.id) {
        const err = new Error("Unauthorized to cancel another user's booking.");
        err.status = 403;
        throw err;
      }

      if (booking.status === 'Cancelled') {
        const err = new Error(`Booking '${bookingId}' is already Cancelled. Seats cannot be restored twice.`);
        err.status = 400;
        throw err;
      }

      await tx.route.update({
        where: { route_id: booking.route_id },
        data: { available_seats: { increment: booking.seats } },
      });

      if (booking.user_id) {
        await tx.user.update({
          where: { id: booking.user_id },
          data: { balance: { increment: booking.total_fare } },
        });
      }

      const updated = await tx.booking.update({
        where: { booking_id: bookingId },
        data: { status: 'Cancelled' },
      });

      return updated;
    });

    return res.json({
      success: true,
      message: `Booking ${bookingId} has been cancelled, ${updatedBooking.seats} seat(s) restored, and Rs. ${updatedBooking.total_fare} refunded to wallet.`,
      booking: updatedBooking,
    });
  } catch (err) {
    console.error('Prisma cancellation error:', err.message);
    return res.status(err.status || 500).json({ error: err.message || 'Database cancellation failed' });
  }
}

// Admin: Reset all bookings and restore route capacity
export async function resetBookings(req, res) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany();
      await tx.user.updateMany({ data: { balance: 10000 } });
      const allRoutes = await tx.route.findMany();
      for (const r of allRoutes) {
        await tx.route.update({
          where: { route_id: r.route_id },
          data: { available_seats: r.total_seats },
        });
      }
    });
    return res.json({ success: true, message: 'All bookings cleared, route seats reset, and user balances restored.' });
  } catch (err) {
    console.error('Reset bookings error:', err);
    return res.status(500).json({ error: err.message || 'Database reset failed.' });
  }
}
