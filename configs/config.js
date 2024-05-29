import dotenv from 'dotenv';

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'T9Xv4j6A3G9r7zVYq2hBnV5uMz8JpF5Q3bLb8t6Kj3E',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bank-backup',
};