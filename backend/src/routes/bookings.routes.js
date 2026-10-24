import { Router } from 'express';
import { 
  getBookings, 
  bookTicket, 
  cancelBooking, 
  resetBookings 
} from '../controllers/bookings.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Passenger/User bookings
router.get('/', authenticateToken, getBookings);
router.post('/', authenticateToken, bookTicket);
router.post('/:id/cancel', authenticateToken, cancelBooking);

// Admin-only reset
router.delete('/reset', authenticateToken, requireAdmin, resetBookings);

export default router;
