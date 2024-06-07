import { Sequelize } from 'sequelize-typescript';
import GitlabAPI from '../init/gitlabAPI';
import RepositoryModel from '../models/repository/repositoryModel';
import { CommitDiffSchema } from '../schema/gitlabSchema'
import { GitLabCommitType, GitLabProjectType, getGitLabBranches, getGitLabCommits, getGitLabContentByCommitId, getGitLabDiffList, getGitLabFolders } from './versionControlService'
import { getGitLabProjects } from "./versionControlService"

const buildGitLabProjects = (): GitLabProjectType[] => {
    return [
        {
            "id": 4,
            "name": "ACME UI",
            "path_with_namespace": "acme/ui",
            "description": "ACME UI desc",
            "created_at": "2013-09-30T13:46:02Z",
            "http_url_to_repo": "https://gitlab",
            "last_activity_at": "2013-09-31T13:46:02Z"
        },
        {
            "id": 5,
            "name": "ACME Service",
            "path_with_namespace": "acme/service",
            "description": "ACME Service desc",
            "created_at": "2014-09-30T13:46:02Z",
            "http_url_to_repo": "https://gitlab",
            "last_activity_at": "2014-09-31T13:46:02Z"
        },
        {
            "id": 15,
            "name": "Utils Service",
            "path_with_namespace": "utils",
            "description": "utils",
            "created_at": "2014-09-20T13:46:02Z",
            "http_url_to_repo": "https://gitlab",
            "last_activity_at": "2014-09-30T13:46:02Z"
        }

    ];
}

const buildGitLabCommits = (): GitLabCommitType[] => {
    return [
        {
            'id': '11',
            'committer_name': 'ric-flair',
            'committer_email': 'ric.flair@wcw.com'
        },
        {
            'id': '12',
            'committer_name': 'goldberg',
            'committer_email': 'goldberg@wcw.com'
        }
    ];
}

const buildGitLabDiffList = (): CommitDiffSchema[] => {
    return [
        {
            diff: "@@ -71,6 +71,8 @@\n sudo -u git -H bundle exec rake..",
            new_path: "doc/update/5.4-to-6.0.md",
            old_path: "doc/update/5.4-to-6.0.md",
            b_mode: "b_mode",
            new_file: false,
            renamed_file: false,
            deleted_file: false,        
        },
        {
            diff: "@@ -11,2 exec rake..",
            new_path: "gradlew",
            old_path: "doc/update/5.4-to-6.0.md",
            b_mode: "b_mode",
            new_file: false,
            renamed_file: false,
            deleted_file: false,
        }
    ];
}

const buildGitLabFolders = () => {
    return [
        {
            "id": "a1e8f8d745cc87e3a9248358d9352bb7f9a0aeba",
            "name": "html",
            "type": "tree",
            "path": "files/html",
            "mode": "040000"
          },
          {
            "id": "4535904260b1082e14f867f7a24fd8c21495bde3",
            "name": "images",
            "type": "tree",
            "path": "files/images",
            "mode": "040000"
          }        
    ]
}

beforeAll( async () => {
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: console.log
    })
    sequelize.addModels([ RepositoryModel, ])
    await sequelize.sync()
})

afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
})

test('testing to get the GitLab projects', async () => {
    const gitLabProjects: GitLabProjectType[] = buildGitLabProjects();
    const path = '/acme';

    const mockedGitlabAPI: GitlabAPI = await buildAPI()
    jest.spyOn(mockedGitlabAPI, 'call').mockReturnValueOnce(
        Promise.resolve(gitLabProjects)
    )

    const projects: GitLabProjectType[] = await getGitLabProjects(mockedGitlabAPI, path);

    expect(mockedGitlabAPI.call).toHaveBeenCalledTimes(1)
    expect(mockedGitlabAPI.call).toHaveBeenCalledWith('projects', {
        'order_by': 'name', 
        'page': '1', 
        'per_page': '100', 
        'sort': 'asc'
    })
    expect(projects.length).toBe(2);
    for(let i=0; i < 2; i++) {
        expect(projects[i].id).toBe(gitLabProjects[i].id);
        expect(projects[i].name).toBe(gitLabProjects[i].name);
        expect(projects[i].path_with_namespace).toBe(gitLabProjects[i].path_with_namespace);
        expect(projects[i].description).toBe(gitLabProjects[i].description);
        expect(projects[i].created_at).toBe(gitLabProjects[i].created_at);
        expect(projects[i].http_url_to_repo).toBe(gitLabProjects[i].http_url_to_repo);
        expect(projects[i].last_activity_at).toBe(gitLabProjects[i].last_activity_at);
    }
})

test('testing to get the GitLab projects with pagination', async () => {
    const gitLabProjects: GitLabProjectType[] = buildGitLabProjects()
    let moreProjects: GitLabProjectType[] = []
    for(let i=0; i<40; i++) 
        moreProjects.push(...gitLabProjects)

    const mockedGitlabAPI: GitlabAPI = await buildAPI()
    jest.spyOn(mockedGitlabAPI, 'call')
        .mockReturnValueOnce(
            Promise.resolve(moreProjects.slice(0, 100))
        )
        .mockReturnValueOnce(
            Promise.resolve(moreProjects.slice(100))
        )

    const path = '/';

    const projects: GitLabProjectType[] = await getGitLabProjects(mockedGitlabAPI, path);

    expect(mockedGitlabAPI.call).toHaveBeenCalledTimes(2)
    expect(projects.length).toBe(120)
});

test('testing to get the GitLab commits', async () => {
    const gitLabCommits = buildGitLabCommits();
    const branch = 'master';
    const projectId = 333;

    const mockedGitlabAPI: GitlabAPI = await buildAPI()
    jest.spyOn(mockedGitlabAPI, 'call').mockReturnValueOnce(
        Promise.resolve(gitLabCommits)
    )

    const commits = await getGitLabCommits(mockedGitlabAPI, projectId, branch);

    expect(mockedGitlabAPI.call).toHaveBeenCalledTimes(1);
    expect(mockedGitlabAPI.call).toHaveBeenCalledWith(
        `/projects/${projectId}/repository/commits`,
        {
            'page': '1',
            'per_page': '100',
            'ref_name': branch
        }
    )

    expect(commits.length).toBe(2)
    for(let i=0; i < 2; i++) {
        expect(commits[i].id).toBe(gitLabCommits[i].id);
        expect(commits[i].committer_name).toBe(gitLabCommits[i].committer_name);
        expect(commits[i].committer_email).toBe(gitLabCommits[i].committer_email);
    }
})

test('testing to get the GitLab diffs', async () => {
    const gitLabDiff = buildGitLabDiffList();
    const commitId = '738479'
    const projectId = 333

    const mockedGitlabAPI: GitlabAPI = await buildAPI()
    jest.spyOn(mockedGitlabAPI, 'call').mockReturnValueOnce(
        Promise.resolve(gitLabDiff)
    )

    const diffs = await getGitLabDiffList(mockedGitlabAPI, projectId, commitId)

    expect(mockedGitlabAPI.call).toHaveBeenCalledTimes(1)
    expect(mockedGitlabAPI.call).toHaveBeenCalledWith(
        `/projects/${projectId}/repository/commits/${commitId}/diff`,
        {
            'page': '1',
            'per_page': '100'
        }
    )

    expect(diffs.length).toBe(2);
    for(let i=0; i < 2; i++) {
        expect(diffs[i].diff).toBe(gitLabDiff[i].diff);
        expect(diffs[i].path).toBe(gitLabDiff[i].new_path);
    }
});

test('testing to get the content', async () => {
    const content: string = 'gjkjtrd5r'
    const commitId = '738479'
    const projectId = 333
    const path = '/kanya 2/!u'

    const mockedGitlabAPI: GitlabAPI = await buildAPI()
    jest.spyOn(mockedGitlabAPI, 'call').mockReturnValueOnce(
        Promise.resolve(content)
    )

    const result = await getGitLabContentByCommitId(mockedGitlabAPI, projectId, path, commitId)

    expect(mockedGitlabAPI.call).toHaveBeenCalledTimes(1)
    expect(mockedGitlabAPI.call).toHaveBeenCalledWith(
        `/projects/${projectId}/repository/files/%2Fkanya%202%2F!u/raw`,
        {
            'ref': commitId
        },
        'text/plain'
    )

    expect(result).toEqual(content)
})

test('testing to get the GitLab folders', async () => {
    const gitLabFolders = buildGitLabFolders()
    const commitId = '738479';
    const projectId = 333

    const mockedGitlabAPI: GitlabAPI = await buildAPI()
    jest.spyOn(mockedGitlabAPI, 'call').mockReturnValueOnce(
        Promise.resolve(gitLabFolders)
    )

    const folders = await getGitLabFolders(mockedGitlabAPI, projectId, commitId);

    expect(mockedGitlabAPI.call).toHaveBeenCalledTimes(1)
    expect(mockedGitlabAPI.call).toHaveBeenCalledWith(
        `/projects/${projectId}/repository/tree`,
        {
            'page': '1',
            'per_page': '100',
            'ref': commitId,
            'path': '/',
            'recursive': true
        }
    )

    expect(folders.length).toBe(2);
    for(let i=0; i < 2; i++) {
        expect(folders[i]).toBe(gitLabFolders[i].path)
    }
})

test('testing to get Gitlab branches', async () => {
    const projectId: number = 333
    const branches: any[] = [
        { 'name': 'master' },
        { 'name': 'develop' }
    ]

    const mockedGitlabAPI: GitlabAPI = await buildAPI()
    jest.spyOn(mockedGitlabAPI, 'call').mockReturnValueOnce(
        Promise.resolve(branches)
    )

    const result: string[] = await getGitLabBranches(mockedGitlabAPI, projectId)

    expect(mockedGitlabAPI.call).toHaveBeenCalledTimes(1)
    expect(mockedGitlabAPI.call).toHaveBeenCalledWith(
        `/projects/${projectId}/repository/branches`,
        {
            'page': '1',
            'per_page': '100',
            'sort': 'updated_desc'
        }
    )

    expect(result.length).toEqual(branches.length)
    expect(result[0]).toEqual(branches[0].name)
    expect(result[1]).toEqual(branches[1].name)
})

const buildAPI = async (): Promise<GitlabAPI> => {
    const repository: RepositoryModel = RepositoryModel.build({
        token: 'U2FsdGVkX1/caNOXKX4BJQTMW+XxLuSvBqGdPd+/kZk=', host: 'http://localhost'
    })

    const spyRepositoryModel = jest
        .spyOn(RepositoryModel, 'findByPk')
        .mockImplementation(() => Promise.resolve(repository))

    return await GitlabAPI.createGitlapAPI(45)
}