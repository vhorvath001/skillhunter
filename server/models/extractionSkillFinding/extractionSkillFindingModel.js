const sequelize = require('../../config/initSequelize');
const {  DataTypes } = require('sequelize');
const { ExtractionModel } = require('../extraction/extractionModel');
const ProjectModel = require('../project/projectModel');
const SkillModel = require('../skill/skillModel,js');

const ExtractionSkillFindingModel = sequelize.define('ExtractionSkillFinding', {
    score: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
});

ExtractionSkillFindingModel.belongsTo(ExtractionModel, { foreignKey: 'extraction_id' });
ExtractionSkillFindingModel.belongsTo(SkillModel, { foreignKey: 'skill_id' });
ExtractionSkillFindingModel.belongsTo(ProjectModel, { foreignKey: 'project_id' });

module.exports = ExtractionSkillFindingModel;