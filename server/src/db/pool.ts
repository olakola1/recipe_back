import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'recipes_db',
    password: 'ваш_пароль',
    port: 5432,
});

export default pool;