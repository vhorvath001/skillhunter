const { Gitlab } = require('@gitbeaker/rest');
const RepositoryModel = require('../models/repository/repositoryModel');

const createGitLabApi = async (repoId) => {
    const { token, host } = await RepositoryModel.findByPk(repoId);
    // TODO the token can be null
    return new Gitlab({
        token: token,
        host: host
    });
}

module.exports = createGitLabApi;