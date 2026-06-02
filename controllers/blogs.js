const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { SECRET } = require('../utils/config');
const { Blog } = require('../models');
const { User } = require('../models');

const blogFinder = async (req, res, next) => {
    try {
        req.blog = await Blog.findByPk(req.params.id);
        if (!req.blog) {
            const error = new Error('Blog not found');
            error.status = 404;
            return next(error);
        }

        next();
    } catch (error) {
        next(error);
    }
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
        } catch {
            return res.status(401).json({ error: 'token missing' });
        }
    } else {
        return res.status(401).json({ error: 'token missing' });
    }
    next();
}

router.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.findAll({
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: ['name']
            }

        });
        res.json(blogs);
    } catch (error) {
        next(error);
    }
});

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id);
        if (!user) {
            return res.status(401).json({ error: 'invalid token' });
        }

        const blog = await Blog.create({...req.body, userId: user.id});
        res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        req.blog.likes = req.body.likes;
        const updatedBlog = await req.blog.save();
        res.json(updatedBlog);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog);
});

router.delete('/:id', blogFinder, async (req, res, next) => {
    try {
        await req.blog.destroy();
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;