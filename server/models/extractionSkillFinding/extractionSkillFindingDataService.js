const ExtractionSkillFindingModel = require('./extractionSkillFindingModel');

const saveExtractionSkillFindingModel = async (score, extractionId, skillId, projectId) => {
    await ExtractionSkillFindingModel.create({
        score: score, 
        extraction_id: extractionId, 
        skill_id: skillId, 
        project_id: projectId
    });
}

module.exports = saveExtractionSkillFindingModel;