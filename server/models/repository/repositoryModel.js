const { DataTypes } = require('sequelize');
const sequelize = require('../../config/initSequelize');

const RepositoryModel = sequelize.define('Repository', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    host: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = RepositoryModel;
