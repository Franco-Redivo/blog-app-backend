const router = require('express').Router();
const { sequelize } = require('../utils/db');
const { User } = require('../models');
const { Blog } = require('../models');

router.get('/', async (req, res) => {
    const users = await User.findAll({
        attributes: [
            ['name', 'author'],
            [sequelize.fn('COUNT', sequelize.col('blogs.id')), 'blogs'],
            [sequelize.fn('SUM', sequelize.col('blogs.likes')), 'likes']
        ],
        include: {
            model: Blog,
            attributes: []
        },
        group: ['User.id'],
        raw: true
    });
    res.json(users.map((user) => ({
        author: user.author,
        blogs: Number(user.blogs),
        likes: Number(user.likes || 0)
    })));
})

module.exports = router;