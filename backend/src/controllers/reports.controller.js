import { prisma } from '../../db.js';
import { SUPPORTED_CITIES } from '../config/constants.js';

// Get analytical booking and revenue reports
export async function getReports(req, res) {
  try {
    const [routesList, bookingsList] = await Promise.all([
      prisma.route.findMany({ orderBy: { route_id: 'asc' } }),
      prisma.booking.findMany(),
    ]);

    const totalBookings = bookingsList.length;
    const confirmedBookings = bookingsList.filter((b) => b.status === 'Confirmed');
    const cancelledBookings = bookingsList.filter((b) => b.status === 'Cancelled');
    const seatsReserved = confirmedBookings.reduce((sum, b) => sum + b.seats, 0);
    const confirmedRevenue = confirmedBookings.reduce((sum, b) => sum + b.total_fare, 0);
    const fullyBookedRoutes = routesList.filter((r) => r.available_seats === 0).length;

    return res.json({
      totalBookings,
      confirmedBookingsCount: confirmedBookings.length,
      cancelledBookingsCount: cancelledBookings.length,
      seatsReserved,
      confirmedRevenue,
      fullyBookedRoutes,
      routeBreakdown: routesList.map((r) => {
        const routeConfirmed = confirmedBookings.filter((b) => b.route_id === r.route_id);
        return {
          ...r,
          confirmedCount: routeConfirmed.length,
          seatsBooked: routeConfirmed.reduce((s, b) => s + b.seats, 0),
          revenue: routeConfirmed.reduce((s, b) => s + b.total_fare, 0),
          isFullyBooked: r.available_seats === 0,
        };
      }),
    });
  } catch (err) {
    console.error('Error fetching report data:', err);
    return res.status(500).json({ error: 'Failed to generate reports.' });
  }
}

// Get timetable schedule grouped by departure hub city
export async function getSchedule(req, res) {
  try {
    const routesList = await prisma.route.findMany({ orderBy: { route_id: 'asc' } });

    const scheduleByCity = SUPPORTED_CITIES.map((city) => ({
      city,
      departures: routesList.filter((r) => r.departure_city.toLowerCase() === city.toLowerCase()),
    }));

    return res.json(scheduleByCity);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    return res.status(500).json({ error: 'Failed to fetch schedule.' });
  }
}
