const express = require('express');
const app = express();

const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');

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


const start = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();