import { Router } from 'express';
import authRoutes from './auth.routes.js';
import routesRoutes from './routes.routes.js';
import bookingsRoutes from './bookings.routes.js';
import adminRoutes from './admin.routes.js';
import reportsRoutes from './reports.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/routes', routesRoutes);
apiRouter.use('/bookings', bookingsRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/', reportsRoutes);

export default apiRouter;
