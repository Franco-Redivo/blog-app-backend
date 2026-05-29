const router = require('express').Router();
const { Blog } = require('../models');

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

router.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body);
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