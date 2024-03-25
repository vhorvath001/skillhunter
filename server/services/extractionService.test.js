const { start } = require('./extractionService');
const saveExtraction = require('../models/extraction/extractionDataService');
// const log = require('../models/progressLog/progressLogDataService');
const createGitLabApi = require('../config/initGitLabApi');
const { getGitLabProjects, getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId } = require('./versionControlService');
const ProgressLogModel = require('../models/progressLog/progressLogModel');
const saveProject = require('../models/project/projectDataService');
const { calculateCumulatedScore, populateSkillsFromContent } = require('./skillService');
const updateSkillTree = require('../models/skill/skillDataService');

// jest.mock('../models/progressLog/progressLogDataService', () => jest.fn());
jest.mock('../models/extraction/extractionDataService', () => jest.fn());
jest.mock('../config/initGitLabApi', () => jest.fn());
jest.mock('./versionControlService', () => ({
    getGitLabProjects: jest.fn(),
    getGitLabCommits: jest.fn(),
    getGitLabDiffList: jest.fn(),
    getGitLabContentByCommitId: jest.fn()
}));
jest.mock('../models/project/projectDataService');
jest.mock('./skillService', () => ({
    calculateCumulatedScore: jest.fn(),
    populateSkillsFromContent: jest.fn()
}));
jest.mock('../models/skill/skillDataService');

const buildGitLabProjects = () => {
    return [
        {
            "id": 4,
            "name": "ACME UI"
        },
        {
            "id": 5,
            "name": "ACME Service"
        }

    ];
}

test('extracting projects->commits->diffs successfully', () => {
    const extractionId = 0;
    const mockedGitLabApi = jest.fn();
    const gitLabProjects = buildGitLabProjects();

    const spyProgressLogModel = jest.spyOn(ProgressLogModel, 'create').mockImplementation(() => {});

    saveExtraction.mockReturnValueOnce(extractionId);
    createGitLabApi.mockReturnValueOnce(mockedGitLabApi);
    getGitLabProjects.mockReturnValueOnce(gitLabProjects);
    getGitLabCommits.mockReturnValueOnce( [ { 'id': '9990' }, { 'id': '9991' } ] )
                    .mockReturnValueOnce( [ { 'id': '9992' } ] );
    getGitLabDiffList.mockReturnValueOnce( [ {'path': 'p1', 'diff': 'd1'}, {'path': 'p2', 'diff': 'd2'} ] )
                     .mockReturnValueOnce( [ {'path': 'p3', 'diff': 'd3'} ] )
                     .mockReturnValueOnce( [ {'path': 'p4', 'diff': 'd4'} ] );
    saveProject.mockReturnValueOnce(1456).mockReturnValueOnce(1457);
    calculateCumulatedScore.mockReturnValueOnce(0.1)
                           .mockReturnValueOnce(0.2)
                           .mockReturnValueOnce(0.3)
                           .mockReturnValueOnce(0.4);
    getGitLabContentByCommitId.mockReturnValueOnce('java1')
                              .mockReturnValueOnce('java2')
                              .mockReturnValueOnce('java3')
                              .mockReturnValueOnce('java4');

    const repoId = 422;
    const path = '/acme';
    const progLangs = [1, 2];
    const branches = { 
        '1456': 'release/2.1',  
        '1457': 'master'
    };

    start(repoId, branches, path, progLangs);

    expect(saveExtraction).toHaveBeenCalledTimes(1);
    expect(saveExtraction).toHaveBeenCalledWith(repoId, branches, path, progLangs);

    expect(spyProgressLogModel).toHaveBeenCalledTimes(7);
    expect(spyProgressLogModel).toHaveBeenNthCalledWith(1, {
        extraction_id: extractionId,
        logText: 'Extraction has started.'
    });

    expect(getGitLabProjects).toHaveBeenCalledTimes(1);
    expect(getGitLabProjects).toHaveBeenCalledWidth(expect.anything(), path);

    expect(saveProject).toHaveBeenCalledTimes(2);
    expect(saveProject).toHaveBeenNthCalledWith(1, gitLabProjects[0].name, extractionId);
    expect(saveProject).toHaveBeenNthCalledWith(2, gitLabProjects[1].name, extractionId);

    expect(getGitLabCommits).toHaveBeenCalledTimes(2);
    expect(getGitLabCommits).toHaveBeenNthCalledWith(1, expect.anything(), 1456, 'release/2.1');
    expect(getGitLabCommits).toHaveBeenNthCalledWith(2, expect.anything(), 1457, 'master');

    expect(getGitLabDiffList).toHaveBeenCalledTimes(3);
    expect(getGitLabDiffList).toHaveBeenNthCalledWith(1, expect.anything(), 1456, '9990');
    expect(getGitLabDiffList).toHaveBeenNthCalledWith(2, expect.anything(), 1456, '9991');
    expect(getGitLabDiffList).toHaveBeenNthCalledWith(2, expect.anything(), 1457, '9992');

    expect(calculateCumulatedScore).toHaveBeenCalledTimes(4);
    expect(calculateCumulatedScore).toHaveBeenNthCalledWith(1, {'path': '1', 'diff': '1'});
    expect(calculateCumulatedScore).toHaveBeenNthCalledWith(2, {'path': '2', 'diff': '2'});
    expect(calculateCumulatedScore).toHaveBeenNthCalledWith(3, {'path': '3', 'diff': '3'});
    expect(calculateCumulatedScore).toHaveBeenNthCalledWith(4, {'path': '4', 'diff': '4'});

    expect(getGitLabContentByCommitId).toHaveBeenCalledTimes(4);
    expect(getGitLabContentByCommitId).toHaveBeenNthCalledWith(1, expect.anything(), 1456, 'p1', 9990);
    expect(getGitLabContentByCommitId).toHaveBeenNthCalledWith(2, expect.anything(), 1456, 'p2', 9990);
    expect(getGitLabContentByCommitId).toHaveBeenNthCalledWith(3, expect.anything(), 1456, 'p3', 9991);
    expect(getGitLabContentByCommitId).toHaveBeenNthCalledWith(4, expect.anything(), 1457, 'p4', 9992);

    expect(populateSkillsFromContent).toHaveBeenCalledTimes(4);
    expect(populateSkillsFromContent).toHaveBeenNthCalledWith(1, expect.anything(), 0.1, 'p1', progLangs, 1456, 9990);
    expect(populateSkillsFromContent).toHaveBeenNthCalledWith(2, expect.anything(), 0.2, 'p2', progLangs, 1456, 9990);
    expect(populateSkillsFromContent).toHaveBeenNthCalledWith(3, expect.anything(), 0.3, 'p3', progLangs, 1456, 9991);
    expect(populateSkillsFromContent).toHaveBeenNthCalledWith(4, expect.anything(), 0.4, 'p4', progLangs, 1457, 9992);

    expect(updateSkillTree).toHaveBeenCalledTimes(2);
    expect(updateSkillTree).toHaveBeenNthCalledWith(1, expect.anyting(), '9990', extractionId);
    expect(updateSkillTree).toHaveBeenNthCalledWith(2, expect.anyting(), '9991', extractionId);



    !!!!!!!!!!!!!! clear & npm test --testFile "server/services/extractionService.test.js" !!!!!!!!!!!!!!!!!!
});