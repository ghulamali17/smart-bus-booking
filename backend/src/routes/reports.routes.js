import { Router } from 'express';
import { getReports, getSchedule } from '../controllers/reports.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/reports', authenticateToken, requireAdmin, getReports);
router.get('/schedule', getSchedule);

export default router;
