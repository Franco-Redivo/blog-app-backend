const express = require('express');
const app = express();

const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');
const { Blog, User } = require('./models');

const blogRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/users');
const authorRouter = require('./controllers/authors');


app.use(express.json());
app.use('/api/blogs', blogRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/authors', authorRouter);
app.use(errorHandler);

app.post('/api/reset', async (req, res) => {
    try {
        await connectToDatabase();
        await Promise.all([
            Blog.destroy({ where: {} }),
            User.destroy({ where: {} })
        ]);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset database' });
    }
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API' });
});


const start = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();