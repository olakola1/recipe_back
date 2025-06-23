"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db/db"); // Импорт из нашего файла
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return db_1.sequelize; } });
const recipe_1 = __importDefault(require("./routes/recipe"));
// Инициализация Express
const app = (0, express_1.default)();
exports.app = app;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Проверка подключения к БД
const checkDatabaseConnection = async () => {
    try {
        await db_1.sequelize.authenticate();
        console.log('Database connection established');
        if (process.env.DB_SYNC === 'true') {
            await db_1.sequelize.sync({ alter: true });
            console.log('Database synchronized');
        }
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
// No-cache middleware
const noCacheMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};
// Routes
app.get('/api/recipes', noCacheMiddleware);
app.use('/api', recipe_1.default);
// Запуск сервера
const startServer = async () => {
    await checkDatabaseConnection();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
        }
    });
};
startServer();
