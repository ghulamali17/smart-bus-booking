import { Router } from 'express';
import { 
  getBookings, 
  bookTicket, 
  cancelBooking, 
  resetBookings 
} from '../controllers/bookings.controller.js';
import { authenticateToken, requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Passenger/User bookings require authentication
router.get('/', authenticateToken, requireAuth, getBookings);
router.post('/', authenticateToken, requireAuth, bookTicket);
router.post('/:id/cancel', authenticateToken, requireAuth, cancelBooking);

// Admin-only reset
router.delete('/reset', authenticateToken, requireAdmin, resetBookings);

export default router;
