import { Router } from 'express';
import { getReports, getSchedule } from '../controllers/reports.controller.js';

const router = Router();

router.get('/reports', getReports);
router.get('/schedule', getSchedule);

export default router;
