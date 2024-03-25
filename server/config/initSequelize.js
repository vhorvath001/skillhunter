const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:', 
    {
        dialect: "sqlite",
        define: {
            freezeTableName: true
        },
        logQueryParameters: true
    });

module.exports = sequelize;