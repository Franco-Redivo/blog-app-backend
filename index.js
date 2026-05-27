require('dotenv').config();
const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});