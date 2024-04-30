import axios from 'axios'
import { calculateCumulatedScore, populateSkillsFromContent } from './skillService'
import { GitLabDiff, getGitLabFolders } from './versionControlService'
import ProgLangModel from '../models/progLang/progLangModel'
import Sequelize from '@sequelize/core'
import TreeNode from '../schema/treeNode'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('./versionControlService', () => ({
    getGitLabFolders: jest.fn()
}))

beforeAll(async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([ ProgLangModel ])
    await sequelize.sync()
})

afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
})

describe('testing populateSkillsFromContent', () => {

    test('the TreeNode is empty, there is only one import, it is not in local folder, scopePattern=FIRST_OCCURRENCE', async () => {
        const pythonProgLangModelId = 23
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, null, null)
        const content: string = 'import org.nav.integration.Caller;\nclass Integrator {\n    private String host;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const progLangIds: number[] = [pythonProgLangModelId, javaProgLangModelId]
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'

        const pythonProgLangModel = ProgLangModel.build({
            id: pythonProgLangModelId,
            name: 'python', 
            sourceFiles: '*.py', 
            patterns: '{"patternList":["from ([a-zA-Z0-9\.]+) import .*"]}',
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })
        const javaProgLangModel = ProgLangModel.build({
            id: javaProgLangModelId,
            name: 'java', 
            sourceFiles: '*.java', 
            level: 2,
            packageSeparator: '.',
            patterns: '{"patternList":["import ([a-zA-Z0-9\.]+);"]}', 
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        const spyProgLangModel = jest
            .spyOn(ProgLangModel, 'findByPk')
            .mockReturnValueOnce(Promise.resolve(pythonProgLangModel))
            .mockReturnValueOnce(Promise.resolve(javaProgLangModel))

        await populateSkillsFromContent(mockedAxios, skillTree, content, score, filePath, progLangIds, projectId, commitId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedAxios, projectId, commitId)

        expect(spyProgLangModel).toHaveBeenCalledTimes(2)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(1, pythonProgLangModelId)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(2, javaProgLangModelId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toBe(score)
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(1)
        const integrationNode: TreeNode = navNode.children[0]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toBe(score)
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)
    })

    test('the TreeNode is empty, there are 2 imports, they are not in local folder, scopePattern=FIRST_OCCURRENCE and there another import after the class declaration => this import will not be included', async () => {
        const pythonProgLangModelId = 23
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, null, null)
        const content: string = 'import org.nav.integration.Caller;\nclass Integrator {\n    private String host;\n}\nimport org.nav.database.Connection;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const progLangIds: number[] = [pythonProgLangModelId, javaProgLangModelId]
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'

        const pythonProgLangModel = ProgLangModel.build({
            id: pythonProgLangModelId,
            name: 'python', 
            sourceFiles: '*.py', 
            patterns: '{"patternList":["from ([a-zA-Z0-9\.]+) import .*"]}',
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })
        const javaProgLangModel = ProgLangModel.build({
            id: javaProgLangModelId,
            name: 'java', 
            sourceFiles: '*.java', 
            level: 2,
            packageSeparator: '.',
            patterns: '{"patternList":["import ([a-zA-Z0-9\.]+);"]}', 
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        const spyProgLangModel = jest
            .spyOn(ProgLangModel, 'findByPk')
            .mockReturnValueOnce(Promise.resolve(pythonProgLangModel))
            .mockReturnValueOnce(Promise.resolve(javaProgLangModel))

        await populateSkillsFromContent(mockedAxios, skillTree, content, score, filePath, progLangIds, projectId, commitId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedAxios, projectId, commitId)

        expect(spyProgLangModel).toHaveBeenCalledTimes(2)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(1, pythonProgLangModelId)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(2, javaProgLangModelId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toBe(score)
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(1)
        const integrationNode: TreeNode = navNode.children[0]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toBe(score)
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)
    })

    test('the TreeNode is empty, there are 2 imports, they are not in local folder, scopePattern=EVERYWHERE and there another import after the class declaration => this import will be taken into account', async () => {
        const pythonProgLangModelId = 23
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, null, null)
        const content: string = 'import org.nav.integration.Caller;\nclass Integrator {\n    private String host;\n}\nimport org.nav.database.Connection;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const progLangIds: number[] = [pythonProgLangModelId, javaProgLangModelId]
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'

        const pythonProgLangModel = ProgLangModel.build({
            id: pythonProgLangModelId,
            name: 'python', 
            sourceFiles: '*.py', 
            patterns: '{"patternList":["from ([a-zA-Z0-9\.]+) import .*"]}',
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })
        const javaProgLangModel = ProgLangModel.build({
            id: javaProgLangModelId,
            name: 'java', 
            sourceFiles: '*.java', 
            level: 2,
            packageSeparator: '.',
            patterns: '{"patternList":["import ([a-zA-Z0-9\.]+);"]}', 
            scopePattern: 'EVERYWHERE', 
            removingTLDPackages: true
        })

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        const spyProgLangModel = jest
            .spyOn(ProgLangModel, 'findByPk')
            .mockReturnValueOnce(Promise.resolve(pythonProgLangModel))
            .mockReturnValueOnce(Promise.resolve(javaProgLangModel))

        await populateSkillsFromContent(mockedAxios, skillTree, content, score, filePath, progLangIds, projectId, commitId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedAxios, projectId, commitId)

        expect(spyProgLangModel).toHaveBeenCalledTimes(2)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(1, pythonProgLangModelId)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(2, javaProgLangModelId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toBe(2 * score)
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(2)
        const integrationNode: TreeNode = navNode.children[0]
        const databaseNode: TreeNode = navNode.children[1]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toBe(score)
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)

        expect(databaseNode.name).toBe('database')
        expect(databaseNode.score).toBe(score)
        expect(databaseNode.progLangId).toBe(javaProgLangModelId)
        expect(databaseNode.children.length).toBe(0)
    })

    test('the TreeNode is empty, there are 2 imports, one of them is in local folder -> it will not be taken into account, scopePattern=FIRST_OCCURRENCE', async () => {
        const pythonProgLangModelId = 23
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, null, null)
        const content: string = 'import org.nav.integration.Caller;\nimport com.acme.database.Connection;\nclass Integrator {\n    private String host;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const progLangIds: number[] = [pythonProgLangModelId, javaProgLangModelId]
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'

        const pythonProgLangModel = ProgLangModel.build({
            id: pythonProgLangModelId,
            name: 'python', 
            sourceFiles: '*.py', 
            patterns: '{"patternList":["from ([a-zA-Z0-9\.]+) import .*"]}',
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })
        const javaProgLangModel = ProgLangModel.build({
            id: javaProgLangModelId,
            name: 'java', 
            sourceFiles: '*.java', 
            level: 2,
            packageSeparator: '.',
            patterns: '{"patternList":["import ([a-zA-Z0-9\.]+);"]}', 
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        const spyProgLangModel = jest
            .spyOn(ProgLangModel, 'findByPk')
            .mockReturnValueOnce(Promise.resolve(pythonProgLangModel))
            .mockReturnValueOnce(Promise.resolve(javaProgLangModel))

        await populateSkillsFromContent(mockedAxios, skillTree, content, score, filePath, progLangIds, projectId, commitId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedAxios, projectId, commitId)

        expect(spyProgLangModel).toHaveBeenCalledTimes(2)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(1, pythonProgLangModelId)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(2, javaProgLangModelId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toBe(score)
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(1)
        const integrationNode: TreeNode = navNode.children[0]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toBe(score)
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)
    })

    test('the TreeNode is not empty, there is only one import, it is not in local folder, scopePattern=FIRST_OCCURRENCE', async () => {
        const pythonProgLangModelId = 23
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const content: string = 'import org.nav.integration.Caller;\nimport org.nav.database.Connection;\nclass Integrator {\n    private String host;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const progLangIds: number[] = [pythonProgLangModelId, javaProgLangModelId]
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'
        const skillTree: TreeNode = new TreeNode(null, null, null, null)
        const _navNode: TreeNode = new TreeNode('nav', skillTree, score, javaProgLangModelId)
        const _integrationNode: TreeNode = new TreeNode('integration', _navNode, score, javaProgLangModelId)

        const pythonProgLangModel = ProgLangModel.build({
            id: pythonProgLangModelId,
            name: 'python', 
            sourceFiles: '*.py', 
            patterns: '{"patternList":["from ([a-zA-Z0-9\.]+) import .*"]}',
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })
        const javaProgLangModel = ProgLangModel.build({
            id: javaProgLangModelId,
            name: 'java', 
            sourceFiles: '*.java', 
            level: 2,
            packageSeparator: '.',
            patterns: '{"patternList":["import ([a-zA-Z0-9\.]+);"]}', 
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true
        })

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        const spyProgLangModel = jest
            .spyOn(ProgLangModel, 'findByPk')
            .mockReturnValueOnce(Promise.resolve(pythonProgLangModel))
            .mockReturnValueOnce(Promise.resolve(javaProgLangModel))

        await populateSkillsFromContent(mockedAxios, skillTree, content, score, filePath, progLangIds, projectId, commitId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedAxios, projectId, commitId)

        expect(spyProgLangModel).toHaveBeenCalledTimes(2)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(1, pythonProgLangModelId)
        expect(spyProgLangModel).toHaveBeenNthCalledWith(2, javaProgLangModelId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        // 'nav' with score 13.4 was already in skillTree before calling populateSkillsFromContent and from the imports we add nav.integration and nav.database with score 13.4 
        //      => in the end 'nav' will have the score 13.4 + 13.4 + 13.4
        expect(navNode.score).toBe(3 * score)
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(2)
        const integrationNode: TreeNode = navNode.children[0]
        const databaseNode: TreeNode = navNode.children[1]

        expect(integrationNode.name).toBe('integration')
        // there was already a 'score' score on the integration skill before calling 'populateSkillsFromContent' so the score is 2*score
        expect(integrationNode.score).toBe(score+score)
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)

        expect(databaseNode.name).toBe('database')
        expect(databaseNode.score).toBe(score)
        expect(databaseNode.progLangId).toBe(javaProgLangModelId)
        expect(databaseNode.children.length).toBe(0)
    })

})

describe('testing calculateCumulatedScore', () => {

    test('one + line', () => {
        const diff: GitLabDiff = {
            diff: '+@Autowired private Context beanContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff)

        expect(score).toBe(1)
    })

    test('one - line', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff)

        expect(score).toBe(0.5)
    })

    test('one - line and one + line but there is a non-changed line between them => not one line changed but one line was removed and another one was added', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;\nprivate int i = 0;\n+protected String s = null;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff)

        expect(score).toBe(1.5)
    })

    test('one - line and one + line but there is a non-changed line between them => not one line changed but one line was removed and another one was added', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;\n+@Autowired private Context beansContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff)

        expect(score).toBe(0.025000000000000022)
    })

})