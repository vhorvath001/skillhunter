const sequelize = require('./initSequelize');
const ProgLangModel = require('../models/progLang/progLangModel');
const RepositoryModel = require('../models/repository/repositoryModel');

const initDB = async () => {
    try {
        await sequelize.sync();
        console.log("Connection to DB was successful");
        await ProgLangModel.create({
            id: 1,
            name: 'Java'
        });
        await ProgLangModel.create({
            id: 2,
            name: 'Python'
        });
        await RepositoryModel.create({
            id: 1,
            name: 'Gitlab'
        });
    } catch(err) {
        console.error("Unable to connect to DB", err);
    }
}


module.exports = initDB;