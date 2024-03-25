const SkillModel = require('./skillModel');

const updateSkillTree = async (parent, skills, projectId, extractionId) => {
    const parentSkillId = parent ? parent.id : null;
    const skillModels = await SkillModel.findAll({
        where: { parent_id: parentSkillId }
    });
    for(const skill of skills) {
        let skillModel = skillModels.find(skillModel => skill.name === skillModel.name && skill.progLangId === skillModel.proglang_id);
        if (!skillModel) {
            skillModel = await SkillModel.create({
                name: skill.name,
                parent_id: parentSkillId,
                proglang_id: skill.progLangId
            });
        }

        saveExtractionSkillFindingModel(score, extractionId, skillModel.id, projectId);

        await updateSkillTree(skillModel, skillModel.getChildren());
    }
}

module.exports = updateSkillTree;