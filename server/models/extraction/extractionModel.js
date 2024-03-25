const { DataTypes } = require('sequelize');
const RepositoryModel = require('../repository/repositoryModel');
const ProgLangModel = require('../progLang/progLangModel');
const sequelize = require('../../config/initSequelize');

const ExtractionModel = sequelize.define('Extraction', {
    branches: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const ExtractionProgLangModel = sequelize.define('ExtractionProgLangCref', {}, { timestamps: false });

ExtractionModel.belongsTo(RepositoryModel, { foreignKey: 'repository_id' });
ExtractionModel.belongsToMany(ProgLangModel, { through: ExtractionProgLangModel, foreignKey: 'extraction_id' });
ProgLangModel.belongsToMany(ExtractionModel, { through: ExtractionProgLangModel, foreignKey: 'proglang_id'});

module.exports = { ExtractionModel, ExtractionProgLangModel };