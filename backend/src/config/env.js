import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || 'smart_bus_booking_super_secret_jwt_key_2026';
export const NODE_ENV = process.env.NODE_ENV || 'development';
