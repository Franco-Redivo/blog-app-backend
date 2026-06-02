const router = require('express').Router();
const { User } = require('../models');
const { Blog } = require('../models');

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    });
    res.json(users);
});

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.params.username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = req.body.name;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;