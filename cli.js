require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const sequelizeOptions = process.env.DB_SSL === 'true'
    ? {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
    : {};

const sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions);

const main = async () => {
    try {
        await sequelize.authenticate();
        const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT });
        blogs.forEach(blog => {
            console.log(`${blog.author}: ${blog.title},  ${blog.likes} likes`);
        });
        sequelize.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

main();