import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { Recipe } from '../model/Recipe';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: console.log
});

export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        await Recipe.initialize();
        console.log('Recipe model initialized');

        if (process.env.DB_SYNC === 'true') {
            await sequelize.sync({ alter: true });
            console.log('Database synchronized');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        throw error;
    }
};

export { sequelize };