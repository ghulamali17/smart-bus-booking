import { prisma } from '../../db.js';

// Get all routes
export async function getAllRoutes(req, res) {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { route_id: 'asc' },
    });
    return res.json(routes);
  } catch (err) {
    console.error('Error fetching routes:', err);
    return res.status(500).json({ error: 'Failed to fetch routes.' });
  }
}

// Get route by ID
export async function getRouteById(req, res) {
  try {
    const routeId = req.params.id.toUpperCase();
    const route = await prisma.route.findUnique({
      where: { route_id: routeId },
    });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    return res.json(route);
  } catch (err) {
    console.error('Error fetching route:', err);
    return res.status(500).json({ error: 'Failed to fetch route.' });
  }
}

// Admin: Add new route
export async function createRoute(req, res) {
  try {
    const { route_id, departure_city, destination_city, departure_time, ticket_price, total_seats } = req.body;

    if (!route_id || !departure_city || !destination_city || !departure_time || !ticket_price || !total_seats) {
      return res.status(400).json({ error: 'All route fields are required.' });
    }

    const cleanRouteId = route_id.trim().toUpperCase();
    const priceNum = parseInt(ticket_price, 10);
    const seatsNum = parseInt(total_seats, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0.' });
    }
    if (isNaN(seatsNum) || seatsNum <= 0) {
      return res.status(400).json({ error: 'Total seats must be greater than 0.' });
    }

    const existing = await prisma.route.findUnique({
      where: { route_id: cleanRouteId },
    });
    if (existing) {
      return res.status(400).json({ error: `Route ID '${cleanRouteId}' already exists.` });
    }

    const newRoute = await prisma.route.create({
      data: {
        route_id: cleanRouteId,
        departure_city: departure_city.trim(),
        destination_city: destination_city.trim(),
        departure_time: departure_time.trim(),
        ticket_price: priceNum,
        total_seats: seatsNum,
        available_seats: seatsNum,
      },
    });

    return res.status(201).json(newRoute);
  } catch (err) {
    console.error('Error adding route:', err);
    return res.status(500).json({ error: 'Database failed to add route.' });
  }
}

// Admin: Update route
export async function updateRoute(req, res) {
  try {
    const routeId = req.params.id.toUpperCase();
    const { departure_city, destination_city, departure_time, ticket_price, total_seats, available_seats } = req.body;

    const priceNum = parseInt(ticket_price, 10);
    const seatsNum = parseInt(total_seats, 10);
    const availNum = parseInt(available_seats, 10);

    const updated = await prisma.route.update({
      where: { route_id: routeId },
      data: {
        departure_city,
        destination_city,
        departure_time,
        ticket_price: priceNum,
        total_seats: seatsNum,
        available_seats: availNum,
      },
    });

    return res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Route not found.' });
    }
    console.error('Error updating route:', err);
    return res.status(500).json({ error: 'Failed to update route.' });
  }
}

// Admin: Delete route
export async function deleteRoute(req, res) {
  try {
    const routeId = req.params.id.toUpperCase();
    await prisma.route.delete({
      where: { route_id: routeId },
    });
    return res.json({ success: true, message: `Route ${routeId} deleted successfully.` });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Route not found.' });
    }
    console.error('Error deleting route:', err);
    return res.status(500).json({ error: 'Failed to delete route.' });
  }
}
