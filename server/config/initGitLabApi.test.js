const RepositoryModel = require("../models/repository/repositoryModel");
const createGitLabApi = require("./initGitLabApi");
const { Gitlab } = require('@gitbeaker/rest');

jest.mock('@gitbeaker/rest', () => ({
    Gitlab: jest.fn()
}));

test('test to create GitLab api object successfully', async () => {
    const token = 'RicFlairWcw';
    const host = 'acme.group.net';
    const repoId = 12;

    const spyRepositoryModel = jest.spyOn(RepositoryModel, 'findByPk').mockImplementation(() => { return {
        token: token,
        host: host
    }});

    const gitLabApi = await createGitLabApi(repoId);

    expect(gitLabApi).toBeTruthy();
    expect(Gitlab).toBeCalledWith({
        token: token,
        host: host
    });
})