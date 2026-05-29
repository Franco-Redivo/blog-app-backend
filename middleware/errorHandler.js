const { ValidationError, DatabaseError } = require('sequelize');

const errorHandler = (error, req, res, next) => {
    if (error.status === 404) {
        return res.status(404).json({ error: error.message });
    }

    if (error instanceof ValidationError || error.name === 'SequelizeValidationError' || error instanceof DatabaseError) {
        return res.status(400).json({ error: error.message });
    }

    next(error);
};

module.exports = errorHandler;