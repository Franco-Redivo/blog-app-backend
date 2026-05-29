const Sequelize = require('sequelize');
const { DATABASE_URL, DB_SSL } = require('./config');

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

const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return process.exit(1);
    }
    return null;
}

module.exports = {
    sequelize,
    connectToDatabase
}