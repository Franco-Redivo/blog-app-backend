const Sequelize = require('sequelize');
const { DATABASE_URL,TEST_DATABASE_URL, DB_SSL } = require('./config');

const isTesting = process.env.NODE_ENV === 'test' || process.env.TESTING === 'true';
const url = isTesting ? TEST_DATABASE_URL : DATABASE_URL;

const sequelizeOptions = DB_SSL
    ? {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
    : {};

const sequelize = new Sequelize(url, sequelizeOptions);

const connectToDatabase = async () => {
    const maxRetries = 12;
    const baseDelayMs = 1000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await sequelize.authenticate();
            console.log('Connection to database has been established successfully.');
            await sequelize.sync({ alter: true });
            console.log('Database synchronized.');
            return null;
        } catch (error) {
            console.error(`Database connection attempt ${attempt} failed:`, error.message || error);
            if (attempt === maxRetries) {
                console.error('Max retries reached. Exiting.');
                return process.exit(1);
            }
            const delay = baseDelayMs * attempt;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

module.exports = {
    sequelize,
    connectToDatabase
}