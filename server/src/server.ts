import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { sequelize, initializeDatabase } from './db/db';
import router from './routes/recipe';

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173', // Локальная разработка
        'https://recipe-font.vercel.app' // Ваш домен на Vercel
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// No-cache middleware
const noCacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

// Routes
app.get('/api/recipes', noCacheMiddleware);
app.use('/api', router);

// Error handling
interface NodeError extends Error {
    code?: string;
}

// Запуск сервера
const startServer = async () => {
    try {
        await initializeDatabase();

        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        }).on('error', (err: NodeError) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use`);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export { app, sequelize };