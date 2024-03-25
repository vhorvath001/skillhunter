const ProjectModel = require('./projectModel');

const saveProject = async (name, extractionId) => {
    const projectModel = await ProjectModel.create({
        name: name,
        extraction_id: extractionId
    });
    return projectModel.id;
}

module.exports = saveProject;