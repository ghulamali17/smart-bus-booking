import { Router } from 'express';
import { 
  getAdminBookings, 
  getAdminStats, 
  getAdminUsers 
} from '../controllers/admin.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.get('/bookings', getAdminBookings);
router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);

export default router;
