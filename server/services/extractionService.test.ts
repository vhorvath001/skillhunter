import saveExtraction from '../models/extraction/extractionDataService'
import createGitLabApi from '../init/initGitLabApi'
import { getGitLabProjects, getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId } from './versionControlService'
import ProgressLogModel from '../models/progressLog/progressLogModel'
import saveProject from '../models/project/projectDataService'
import { calculateCumulatedScore, populateSkillsFromContent } from './skillService'
import updateSkillTree from '../models/skill/skillDataService'
import { ExtractionModel } from '../models/extraction/extractionModel'
import Sequelize from '@sequelize/core'
import RepositoryModel from '../models/repository/repositoryModel'
import ProgLangModel from '../models/progLang/progLangModel'
import { start } from './extractionService'
import logger from '../init/initLogger'

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
            "id": 1456,
            "name": "ACME UI"
        },
        {
            "id": 1457,
            "name": "ACME Service"
        }

    ];
}

beforeAll( async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([ ProgLangModel, ExtractionModel , RepositoryModel, ProgressLogModel ])
    await sequelize.sync()
})

afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
})

test('extracting projects -> commits -> diffs successfully', async () => {
    const extractionId: number = 0
    const mockedGitLabApi: jest.Mock<any, any, any> = jest.fn()
    const gitLabProjects = buildGitLabProjects();

    const spyProgressLogModel = jest.spyOn(ProgressLogModel, 'create').mockImplementation(() => {});

    const mockedSaveExtraction: jest.Mock = saveExtraction as jest.Mock
    const mockedCreateGitLabApi: jest.Mock = createGitLabApi as jest.Mock
    const mockedGetGitLabProjects: jest.Mock = getGitLabProjects as jest.Mock
    const mockedGetGitLabCommits: jest.Mock = getGitLabCommits as jest.Mock
    const mockedGetGitLabDiffList: jest.Mock = getGitLabDiffList as jest.Mock
    const mockedSaveProject: jest.Mock = saveProject as jest.Mock
    const mockedCalculateCumulatedScore: jest.Mock = calculateCumulatedScore as jest.Mock
    const mockedGetGitLabContentByCommitId: jest.Mock = getGitLabContentByCommitId as jest.Mock
    const mockedPopulateSkillsFromContent: jest.Mock = populateSkillsFromContent as jest.Mock
    const mockedUpdateSkillTree: jest.Mock = updateSkillTree as jest.Mock

    mockedSaveExtraction.mockReturnValueOnce(extractionId);
    mockedCreateGitLabApi.mockReturnValueOnce(mockedGitLabApi);
    mockedGetGitLabProjects.mockReturnValueOnce(gitLabProjects);
    mockedGetGitLabCommits.mockReturnValueOnce( [ { 'id': '9990' }, { 'id': '9991' } ] )
                          .mockReturnValueOnce( [ { 'id': '9992' } ] );
    mockedGetGitLabDiffList.mockReturnValueOnce( [ {'path': 'p1', 'diff': 'd1'}, {'path': 'p2', 'diff': 'd2'} ] )
                           .mockReturnValueOnce( [ {'path': 'p3', 'diff': 'd3'} ] )
                           .mockReturnValueOnce( [ {'path': 'p4', 'diff': 'd4'} ] );
    mockedSaveProject.mockReturnValueOnce(1456).mockReturnValueOnce(1457);
    mockedCalculateCumulatedScore.mockReturnValueOnce(0.1)
                                 .mockReturnValueOnce(0.2)
                                 .mockReturnValueOnce(0.3)
                                 .mockReturnValueOnce(0.4);
    mockedGetGitLabContentByCommitId.mockReturnValueOnce('java1')
                                    .mockReturnValueOnce('java2')
                                    .mockReturnValueOnce('java3')
                                    .mockReturnValueOnce('java4');

    const repoId = 422;
    const path = '/acme';
    const progLangs = [1, 2];
    const branches = { 
        1456: 'release/2.1',  
        1457: 'master'
    };

    await start(repoId, branches, path, progLangs);

    expect(mockedSaveExtraction).toHaveBeenCalledTimes(1);
    expect(mockedSaveExtraction).toHaveBeenCalledWith(repoId, branches, path, progLangs);

    expect(spyProgressLogModel).toHaveBeenCalledTimes(7);
    expect(spyProgressLogModel).toHaveBeenNthCalledWith(1, expect.objectContaining({
        logText: 'Extraction has started.'
    }), expect.anything())
    expect(spyProgressLogModel).toHaveBeenNthCalledWith(2, expect.objectContaining({
        logText: 'Found 2 projects in GitLab to process.'
    }), expect.anything())

    expect(mockedGetGitLabProjects).toHaveBeenCalledTimes(1);
    expect(mockedGetGitLabProjects).toHaveBeenCalledWith(expect.anything(), path);

    expect(mockedSaveProject).toHaveBeenCalledTimes(2);
    expect(mockedSaveProject).toHaveBeenNthCalledWith(1, gitLabProjects[0].name, extractionId);
    expect(mockedSaveProject).toHaveBeenNthCalledWith(2, gitLabProjects[1].name, extractionId);

    expect(mockedGetGitLabCommits).toHaveBeenCalledTimes(2);
    expect(mockedGetGitLabCommits).toHaveBeenNthCalledWith(1, expect.anything(), 1456, 'release/2.1');
    expect(mockedGetGitLabCommits).toHaveBeenNthCalledWith(2, expect.anything(), 1457, 'master');

    expect(mockedGetGitLabDiffList).toHaveBeenCalledTimes(3);
    expect(mockedGetGitLabDiffList).toHaveBeenNthCalledWith(1, expect.anything(), 1456, '9990');
    expect(mockedGetGitLabDiffList).toHaveBeenNthCalledWith(2, expect.anything(), 1456, '9991');
    expect(mockedGetGitLabDiffList).toHaveBeenNthCalledWith(3, expect.anything(), 1457, '9992');

    expect(mockedCalculateCumulatedScore).toHaveBeenCalledTimes(4);
    expect(mockedCalculateCumulatedScore).toHaveBeenNthCalledWith(1, {'path': 'p1', 'diff': 'd1'});
    expect(mockedCalculateCumulatedScore).toHaveBeenNthCalledWith(2, {'path': 'p2', 'diff': 'd2'});
    expect(mockedCalculateCumulatedScore).toHaveBeenNthCalledWith(3, {'path': 'p3', 'diff': 'd3'});
    expect(mockedCalculateCumulatedScore).toHaveBeenNthCalledWith(4, {'path': 'p4', 'diff': 'd4'});

    expect(mockedGetGitLabContentByCommitId).toHaveBeenCalledTimes(4);
    expect(mockedGetGitLabContentByCommitId).toHaveBeenNthCalledWith(1, expect.anything(), 1456, 'p1', '9990');
    expect(mockedGetGitLabContentByCommitId).toHaveBeenNthCalledWith(2, expect.anything(), 1456, 'p2', '9990');
    expect(mockedGetGitLabContentByCommitId).toHaveBeenNthCalledWith(3, expect.anything(), 1456, 'p3', '9991');
    expect(mockedGetGitLabContentByCommitId).toHaveBeenNthCalledWith(4, expect.anything(), 1457, 'p4', '9992');

    expect(mockedPopulateSkillsFromContent).toHaveBeenCalledTimes(4);
    expect(mockedPopulateSkillsFromContent).toHaveBeenNthCalledWith(1, expect.anything(), expect.anything(), 'java1', 0.1, 'p1', progLangs, 1456, '9990');
    expect(mockedPopulateSkillsFromContent).toHaveBeenNthCalledWith(2, expect.anything(), expect.anything(), 'java2', 0.2, 'p2', progLangs, 1456, '9990');
    expect(mockedPopulateSkillsFromContent).toHaveBeenNthCalledWith(3, expect.anything(), expect.anything(), 'java3', 0.3, 'p3', progLangs, 1456, '9991');
    expect(mockedPopulateSkillsFromContent).toHaveBeenNthCalledWith(4, expect.anything(), expect.anything(), 'java4', 0.4, 'p4', progLangs, 1457, '9992');

    expect(mockedUpdateSkillTree).toHaveBeenCalledTimes(2);
    expect(mockedUpdateSkillTree).toHaveBeenNthCalledWith(1, undefined, [], 1456, extractionId);
    expect(mockedUpdateSkillTree).toHaveBeenNthCalledWith(2, undefined, [], 1457, extractionId);
})