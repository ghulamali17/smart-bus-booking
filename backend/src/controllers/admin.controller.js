import { prisma } from '../../db.js';

// Admin: Get all bookings with associated passenger audit data
export async function getAdminBookings(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const formatted = bookings.map((b) => ({
      ...b,
      booked_by_user_name: b.user?.name || null,
      booked_by_user_email: b.user?.email || null,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('Admin bookings query failed:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
}

// Admin: System Statistics
export async function getAdminStats(req, res) {
  try {
    const [routesList, bookingsList, usersList] = await Promise.all([
      prisma.route.findMany(),
      prisma.booking.findMany(),
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, created_at: true } }),
    ]);

    const confirmed = bookingsList.filter((b) => b.status === 'Confirmed');
    const cancelled = bookingsList.filter((b) => b.status === 'Cancelled');
    const totalRevenue = confirmed.reduce((sum, b) => sum + b.total_fare, 0);
    const totalSeats = routesList.reduce((sum, r) => sum + r.total_seats, 0);
    const availableSeats = routesList.reduce((sum, r) => sum + r.available_seats, 0);

    return res.json({
      totalUsers: usersList.length,
      totalRoutes: routesList.length,
      totalBookings: bookingsList.length,
      confirmedBookingsCount: confirmed.length,
      cancelledBookingsCount: cancelled.length,
      totalRevenue,
      totalSeats,
      availableSeats,
      occupancyRate: totalSeats > 0 ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100) : 0,
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    return res.status(500).json({ error: 'Failed to retrieve system statistics.' });
  }
}

// Admin: List all registered users
export async function getAdminUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, balance: true, created_at: true },
      orderBy: { id: 'asc' },
    });
    return res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
}
