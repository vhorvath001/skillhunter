import { CommitDiffSchema } from '../schema/gitlabSchema'
import { GitLabCommitType, GitLabProjectType, getGitLabCommits, getGitLabDiffList, getGitLabFolders } from './versionControlService'
import { getGitLabProjects } from "./versionControlService"
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

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

afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
});

test('testing to get the GitLab projects', async () => {
    const gitLabProjects: GitLabProjectType[] = buildGitLabProjects();

    mockedAxios.get.mockResolvedValueOnce({
        data: gitLabProjects
    })

    const path = '/acme';

    const projects: GitLabProjectType[] = await getGitLabProjects(mockedAxios, path);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
        'projects',
        {'params': {
            'page': 1,
            'per_page': 100,
            'queryParams': {}
        }}
    )
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
    const gitLabProjects: GitLabProjectType[] = buildGitLabProjects();
    let moreProjects: GitLabProjectType[] = []
    for(var i=0; i<40; i++) 
        moreProjects.push(...gitLabProjects)

    mockedAxios.get.mockResolvedValueOnce({
        data: moreProjects.slice(0, 100)
    }).mockResolvedValueOnce({
        data: moreProjects.slice(100)
    })

    const path = '/';

    const projects: GitLabProjectType[] = await getGitLabProjects(mockedAxios, path);

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(projects.length).toBe(120);
});

test('testing to get the GitLab commits', async () => {
    const gitLabCommits = buildGitLabCommits();
    const branch = 'master';
    const projectId = 333;

    mockedAxios.get.mockResolvedValueOnce({
        data: gitLabCommits
    })

    const commits = await getGitLabCommits(mockedAxios, projectId, branch);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
        `/projects/${projectId}/repository/commits`,
        {'params': {
            'page': 1,
            'per_page': 100,
            'queryParams': {
                'ref_name': branch
            }
        }}
    )

    expect(commits.length).toBe(2);
    for(let i=0; i < 2; i++) {
        expect(commits[i].id).toBe(gitLabCommits[i].id);
        expect(commits[i].committer_name).toBe(gitLabCommits[i].committer_name);
        expect(commits[i].committer_email).toBe(gitLabCommits[i].committer_email);
    }
});

test('testing to get the GitLab diffs', async () => {
    const gitLabDiff = buildGitLabDiffList();
    const commitId = '738479';
    const projectId = 333

    mockedAxios.get.mockResolvedValueOnce({
        data: gitLabDiff
    })

    const diffs = await getGitLabDiffList(mockedAxios, projectId, commitId);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
        `/projects/${projectId}/repository/commits/${commitId}/diff`,
        {'params': {
            'page': 1,
            'per_page': 100,
            'queryParams': { }
        }}
    )

    expect(diffs.length).toBe(2);
    for(let i=0; i < 2; i++) {
        expect(diffs[i].diff).toBe(gitLabDiff[i].diff);
        expect(diffs[i].path).toBe(gitLabDiff[i].new_path);
    }
});

test('testing to get the GitLab folders', async () => {
    const gitLabFolders = buildGitLabFolders()
    const commitId = '738479';
    const projectId = 333

    mockedAxios.get.mockResolvedValueOnce({
        data: gitLabFolders
    })

    const folders = await getGitLabFolders(mockedAxios, projectId, commitId);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
        `/projects/${projectId}/repository/tree`,
        {'params': {
            'page': 1,
            'per_page': 100,
            'queryParams': {
                'ref': commitId,
                'path': '/',
                'recursive': true
            }
        }}
    )

    expect(folders.length).toBe(2);
    for(let i=0; i < 2; i++) {
        expect(folders[i]).toBe(gitLabFolders[i].path)
    }
});