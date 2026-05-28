require('dotenv').config();
const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

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

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    author: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, { 
    sequelize, 
    modelName: 'blog', 
    timestamps: false, 
    underscored: true
})

Blog.sync();

app.get('/api/blogs', async (req,res) => {
    const blogs = await Blog.findAll();
    res.json(blogs);
})

app.post('/api/blogs', async (req,res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/blogs/:id', async (req,res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if(blog) {
            await blog.update(req.body);
            res.json(blog);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.get('/api/blogs/:id', async (req,res) => {
    const blog = await Blog.findByPk(req.params.id);
    if(blog) {
        res.json(blog);
    } else {
        res.status(404).json({ error: 'Blog not found'});
    }
})

app.delete('/api/blogs/:id', async (req,res) => {
    const blog = await Blog.findByPk(req.params.id);
    if(blog) {
        await blog.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Blog not found'});
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});