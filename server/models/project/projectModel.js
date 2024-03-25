const sequelize = require('../../config/initSequelize');
const { DataTypes } = require('sequelize');
const { ExtractionModel } = require('../extraction/extractionModel');

const ProjectModel = sequelize.define('Project', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

ProjectModel.belongsTo(ExtractionModel, { foreignKey: 'extraction_id' });

module.exports = ProjectModel;