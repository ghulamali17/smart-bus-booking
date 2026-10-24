import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export let isDbConnected = false;

export async function initDB() {
  try {
    await prisma.$connect();
    isDbConnected = true;
    console.log('✅ Connected to PostgreSQL database with Prisma ORM successfully.');

    // 1. Seed initial admin and normal user if empty
    const usersCount = await prisma.user.count();
    if (usersCount === 0) {
      console.log('🌱 Seeding initial admin and normal user via Prisma...');
      const adminHash = await bcrypt.hash('admin123', 10);
      const userHash = await bcrypt.hash('user123', 10);

      await prisma.user.createMany({
        data: [
          {
            name: 'System Administrator',
            email: 'admin@smartbus.com',
            password: adminHash,
            role: 'admin',
          },
          {
            name: 'Ali Khan',
            email: 'user@smartbus.com',
            password: userHash,
            role: 'user',
          },
        ],
      });
      console.log('✅ Seeded admin (admin@smartbus.com / admin123) and user (user@smartbus.com / user123).');
    }

    // 2. Seed starter routes if empty
    const routesCount = await prisma.route.count();
    if (routesCount === 0) {
      console.log('🌱 Seeding initial 5 starter routes via Prisma...');
      await prisma.route.createMany({
        data: [
          { route_id: 'R101', departure_city: 'Karachi', destination_city: 'Hyderabad', departure_time: '08:00 AM', ticket_price: 1200, total_seats: 40, available_seats: 40 },
          { route_id: 'R102', departure_city: 'Karachi', destination_city: 'Sukkur', departure_time: '09:30 AM', ticket_price: 2000, total_seats: 36, available_seats: 36 },
          { route_id: 'R103', departure_city: 'Hyderabad', destination_city: 'Mirpur Khas', departure_time: '11:00 AM', ticket_price: 800, total_seats: 32, available_seats: 32 },
          { route_id: 'R104', departure_city: 'Karachi', destination_city: 'Lahore', departure_time: '07:00 PM', ticket_price: 5000, total_seats: 45, available_seats: 45 },
          { route_id: 'R105', departure_city: 'Sukkur', destination_city: 'Hyderabad', departure_time: '02:00 PM', ticket_price: 1500, total_seats: 30, available_seats: 30 },
        ],
        skipDuplicates: true,
      });
      console.log('✅ Initial routes seeded successfully via Prisma.');
    }
  } catch (err) {
    isDbConnected = false;
    console.warn('\n⚠️  [Prisma Database Connection Notice]');
    console.warn(`   Could not connect to PostgreSQL via Prisma: ${err.message}`);
    console.warn('   👉 Please ensure PostgreSQL is running and credentials in backend/.env are valid.\n');
  }
}
