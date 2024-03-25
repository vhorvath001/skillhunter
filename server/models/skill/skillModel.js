const sequelize = require('../../config/initSequelize');
const { DataTypes } = require('sequelize');
const ProgLangModel = require('../progLang/progLangModel');

const SkillModel = sequelize.define('Skill', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

SkillModel.belongsTo(SkillModel, { foreignKey: 'parent_id' });
SkillModel.belongsTo(ProgLangModel, { foreignKey: 'proglang_id' });


module.exports = SkillModel;