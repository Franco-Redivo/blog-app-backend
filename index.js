const express = require('express');
const app = express();

const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');

const blogRouter = require('./controllers/blogs');

app.use(express.json());
app.use('/api/blogs', blogRouter);
app.use(errorHandler);


const start = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();