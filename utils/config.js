require ('dotenv').config();

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL,
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    DB_SSL: process.env.DB_SSL === 'true',
    PORT: process.env.PORT || 3000,
    SECRET: process.env.SECRET || 'mysecretkey'
}