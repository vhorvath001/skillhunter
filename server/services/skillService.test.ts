import { calculateCumulatedScore, populateSkillsFromContent } from './skillService'
import { GitLabDiff, getGitLabFolders } from './versionControlService'
import ProgLangModel from '../models/progLang/progLangModel'
import { Sequelize } from 'sequelize-typescript'
import TreeNode from '../schema/treeNode'
import GitlabAPI from '../init/gitlabAPI'

jest.mock('./versionControlService', () => ({
    getGitLabFolders: jest.fn()
}))
jest.mock('../init/gitlabAPI')

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
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, [], null)
        const content: string = 'import org.nav.integration.Caller;\nclass Integrator {\n    private String host;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'
        const developerId: number = 322738

        const pythonProgLangModel = ProgLangModel.build({
            id: 23,
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
        const progLangs: ProgLangModel[] = [pythonProgLangModel, javaProgLangModel]

        const mockedGitlabAPI = jest.fn() as GitlabAPI
        
        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)

        await populateSkillsFromContent(mockedGitlabAPI, skillTree, content, score, filePath, progLangs, projectId, commitId, developerId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedGitlabAPI, projectId, commitId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(1)
        const integrationNode: TreeNode = navNode.children[0]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toEqual( [{ score: score, developerId: developerId }] )
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)
    })

    test('the TreeNode is empty, there are 2 imports, they are not in local folder, scopePattern=FIRST_OCCURRENCE and there another import after the class declaration => this import will not be included', async () => {
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, [], null)
        const content: string = 'import org.nav.integration.Caller;\nclass Integrator {\n    private String host;\n}\nimport org.nav.database.Connection;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'
        const developerId: number = 322738

        const pythonProgLangModel = ProgLangModel.build({
            id: 23,
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
        const progLangs: ProgLangModel[] = [pythonProgLangModel, javaProgLangModel]

        const mockedGitlabAPI = jest.fn() as GitlabAPI

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        
        await populateSkillsFromContent(mockedGitlabAPI, skillTree, content, score, filePath, progLangs, projectId, commitId, developerId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedGitlabAPI, projectId, commitId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(1)
        const integrationNode: TreeNode = navNode.children[0]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)
    })

    test('the TreeNode is empty, there are 2 imports, they are not in local folder, scopePattern=EVERYWHERE and there another import after the class declaration => this import will be taken into account', async () => {
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, [], null)
        const content: string = 'import org.nav.integration.Caller;\nclass Integrator {\n    private String host;\n}\nimport org.nav.database.Connection;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'
        const developerId: number = 322738

        const pythonProgLangModel = ProgLangModel.build({
            id: 23,
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
        const progLangs: ProgLangModel[] = [pythonProgLangModel, javaProgLangModel]

        const mockedGitlabAPI = jest.fn() as GitlabAPI

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        
        await populateSkillsFromContent(mockedGitlabAPI, skillTree, content, score, filePath, progLangs, projectId, commitId, developerId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedGitlabAPI, projectId, commitId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toEqual([{ score: 2 * score, developerId: developerId }])
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(2)
        const integrationNode: TreeNode = navNode.children[0]
        const databaseNode: TreeNode = navNode.children[1]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)

        expect(databaseNode.name).toBe('database')
        expect(databaseNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(databaseNode.progLangId).toBe(javaProgLangModelId)
        expect(databaseNode.children.length).toBe(0)
    })

    test('the TreeNode is empty, there are 2 imports, one of them is in local folder -> it will not be taken into account, scopePattern=FIRST_OCCURRENCE', async () => {
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, [], null)
        const content: string = 'import org.nav.integration.Caller;\nimport com.acme.database.Connection;\nclass Integrator {\n    private String host;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'
        const developerId: number = 322738

        const pythonProgLangModel = ProgLangModel.build({
            id: 23,
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
        const progLangs: ProgLangModel[] = [pythonProgLangModel, javaProgLangModel]

        const mockedGitlabAPI = jest.fn() as GitlabAPI

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        
        await populateSkillsFromContent(mockedGitlabAPI, skillTree, content, score, filePath, progLangs, projectId, commitId, developerId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedGitlabAPI, projectId, commitId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(1)
        const integrationNode: TreeNode = navNode.children[0]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)
    })

    test('the TreeNode is not empty, there is only one import, it is not in local folder, scopePattern=FIRST_OCCURRENCE', async () => {
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const content: string = 'import org.nav.integration.Caller;\nimport org.nav.database.Connection;\nclass Integrator {\n    private String host;'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'
        const developerId: number = 322738
        const skillTree: TreeNode = new TreeNode(null, null, [], null)
        const _navNode: TreeNode = new TreeNode('nav', skillTree, [{ score: score, developerId: developerId }], javaProgLangModelId)
        const _integrationNode: TreeNode = new TreeNode('integration', _navNode, [{ score: score, developerId: developerId }], javaProgLangModelId)

        const pythonProgLangModel = ProgLangModel.build({
            id: 23,
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
        const progLangs: ProgLangModel[] = [pythonProgLangModel, javaProgLangModel]

        const mockedGitlabAPI = jest.fn() as GitlabAPI

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        
        await populateSkillsFromContent(mockedGitlabAPI, skillTree, content, score, filePath, progLangs, projectId, commitId, developerId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedGitlabAPI, projectId, commitId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        // 'nav' with score 13.4 was already in skillTree before calling populateSkillsFromContent and from the imports we add nav.integration and nav.database with score 13.4 
        //      => in the end 'nav' will have the score 13.4 + 13.4 + 13.4
        expect(navNode.score).toEqual([{ score: 3 * score, developerId: developerId }])
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(2)
        const integrationNode: TreeNode = navNode.children[0]
        const databaseNode: TreeNode = navNode.children[1]

        expect(integrationNode.name).toBe('integration')
        // there was already a 'score' score on the integration skill before calling 'populateSkillsFromContent' so the score is 2*score
        expect(integrationNode.score).toEqual([{ score: 2 * score, developerId: developerId }])
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)

        expect(databaseNode.name).toBe('database')
        expect(databaseNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(databaseNode.progLangId).toBe(javaProgLangModelId)
        expect(databaseNode.children.length).toBe(0)
    })

    test('check if the packageRemovalPatterns / IGNORING_PACKAGE is set then the whole package is ignored', async () => {
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, [], null)
        const content: string = 'import org.nav.integration.Caller;\nimport org.nav.database.Connection;\nclass Integrator {\n    private String host;\n}'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'
        const developerId: number = 322738

        const pythonProgLangModel = ProgLangModel.build({
            id: 23,
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
            removingTLDPackages: true,
            packageRemovalPatterns: '{"patternList":[{"type":"IGNORING_PACKAGE","value":".*database.*"}]}'
        })
        const progLangs: ProgLangModel[] = [pythonProgLangModel, javaProgLangModel]

        const mockedGitlabAPI = jest.fn() as GitlabAPI

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        
        await populateSkillsFromContent(mockedGitlabAPI, skillTree, content, score, filePath, progLangs, projectId, commitId, developerId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedGitlabAPI, projectId, commitId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(1)
        const integrationNode: TreeNode = navNode.children[0]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)
    })

    test('check if the packageRemovalPatterns / REMOVING_FROM_PACKAGE is set then the unnecessary part in package is removed and the rest of the package is still used', async () => {
        const javaProgLangModelId = 6
        const gitlabFolders: string[] = ['/com/pear', '/com/acme']
        const skillTree: TreeNode = new TreeNode(null, null, [], null)
        const content: string = 'import org.nav.integration.Caller;\nclass Integrator {\n    private String host;\n}'
        const score: number = 13.4
        const filePath: string = '/home/lv30083/work/src/Integrator.java'
        const projectId: number = 456
        const commitId: string = 'Hfj74fh76g'
        const developerId: number = 322738

        const pythonProgLangModel = ProgLangModel.build({
            id: 23,
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
            level: 5,
            packageSeparator: '.',
            patterns: '{"patternList":["import ([a-zA-Z0-9\.]+);"]}', 
            scopePattern: 'FIRST_OCCURRENCE', 
            removingTLDPackages: true,
            packageRemovalPatterns: '{"patternList":[{"type":"REMOVING_FROM_PACKAGE","value":"(?<=[a-zA-Z0-9\.]+)[\.]{1}[A-Z]{1}[a-zA-Z0-9]*$"}]}'
        })
        const progLangs: ProgLangModel[] = [pythonProgLangModel, javaProgLangModel]

        const mockedGitlabAPI = jest.fn() as GitlabAPI

        const mockedGetGitLabFolders: jest.Mock = getGitLabFolders as jest.Mock
        mockedGetGitLabFolders.mockReturnValueOnce(gitlabFolders)
        
        await populateSkillsFromContent(mockedGitlabAPI, skillTree, content, score, filePath, progLangs, projectId, commitId, developerId)

        expect(mockedGetGitLabFolders).toHaveBeenCalledTimes(1)
        expect(mockedGetGitLabFolders).toHaveBeenCalledWith(mockedGitlabAPI, projectId, commitId)

        expect(skillTree.children.length).toBe(1)
        const navNode: TreeNode = skillTree.children[0]

        expect(navNode.name).toBe('nav')
        expect(navNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(navNode.progLangId).toBe(javaProgLangModelId)
        expect(navNode.children.length).toBe(1)
        const integrationNode: TreeNode = navNode.children[0]

        expect(integrationNode.name).toBe('integration')
        expect(integrationNode.score).toEqual([{ score: score, developerId: developerId }])
        expect(integrationNode.progLangId).toBe(javaProgLangModelId)
        expect(integrationNode.children.length).toBe(0)
    })

})

describe('testing calculateCumulatedScore', () => {

    test('one + line', () => {
        const diff: GitLabDiff = {
            diff: '+@Autowired private Context beanContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff, [])

        expect(score).toBe(39 * 1)
    })

    test('one - line', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff, [])

        expect(score).toBe(0.5)
    })

    test('one - line and one + line but there is a non-changed line between them => not one line changed but one line was removed and another one was added', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;\nprivate int i = 0;\n+protected String s = null;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff, [])

        expect(score).toBe(26.5)
    })

    test('one - line and one + line', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;\n+@Autowired private Context beansContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff, [])

        expect(score).toEqual(1.0)
    })

    test('two - lines and two + lines -> they will be paired by order (i.e. not matching by least difference)', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;\n-@Autowired private Context2 beanContext2;\n+@Autowired public MyContext myBeanContext;\n+@Autowired private Context beanContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff, [])

        expect(score).toBe(11.902439024390242)
    })

    test('one - line and two + lines -> they will be paired by matching (i.e. not matching by order but finding that + line which is the least different from the - line => one - and one + line are equal so their score will be zero)', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;\n+@Autowired public MyContext myBeanContext;\n+@Autowired private Context beanContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff, [])

        expect(score).toBe(42.0)
    })

    test('one - line and two + lines -> see the test above but in this case the 2nd + line will be ignored => there will be one - and one + line', () => {
        const diff: GitLabDiff = {
            diff: '-@Autowired private Context beanContext;\n+@Autowired public MyContext myBeanContext;\n+@Autowired private Context beanContext;',
            path: '/home/tg53453/projects'
        }

        const score: number = calculateCumulatedScore(diff, ['.*private Context.*'])

        expect(score).toBe(10.0)
    })

})