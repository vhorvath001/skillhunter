const { DataTypes } = require('sequelize');
const { ExtractionModel } = require('../extraction/extractionModel');
const sequelize = require('../../config/initSequelize');

const ProgressLogModel = sequelize.define('ProgressLog', {
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    logText: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

ProgressLogModel.belongsTo(ExtractionModel, { foreignKey: 'extraction_id' });

module.exports = ProgressLogModel;