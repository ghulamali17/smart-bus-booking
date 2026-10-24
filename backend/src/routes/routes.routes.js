import { Router } from 'express';
import { 
  getAllRoutes, 
  getRouteById, 
  createRoute, 
  updateRoute, 
  deleteRoute 
} from '../controllers/routes.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllRoutes);
router.get('/:id', getRouteById);

// Admin-protected routes
router.post('/', authenticateToken, requireAdmin, createRoute);
router.put('/:id', authenticateToken, requireAdmin, updateRoute);
router.delete('/:id', authenticateToken, requireAdmin, deleteRoute);

export default router;
