import express, { Request, Response, NextFunction } from 'express';
import router from './routes/recipe';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// Инициализация Sequelize
const sequelize = new Sequelize(
    process.env.SUBD_DB_NAME || 'recipes_db',
    process.env.SUBD_DB_USER || 'postgres',
    process.env.SUBD_DB_PASS || 'mysecretpassword',
    {
        host: process.env.SUBD_DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: console.log
    }
);

// Проверка подключения
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        if (process.env.SUBD_DB_SYNC === 'yes') {
            await sequelize.sync({ alter: true });
            console.log('Database synchronized');
        }
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
})();

interface NodeError extends Error {
    code?: string;
}

const server = express();

// Middleware для отключения кеширования
const noCacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

// Настройки CORS для разработки
server.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Парсинг JSON
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ limit: '10mb', extended: true }));

// Применяем noCacheMiddleware
server.get('/api/recipes', noCacheMiddleware);

// Основной роутер
server.use('/api', router);

// Запуск сервера
const PORT = process.env.DEV_PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err: NodeError) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
});

export { server, sequelize };