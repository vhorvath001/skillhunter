const { getGitLabProjects } = require("./versionControlService");

const buildGitLabProjects = () => {
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
            "path_with_namespace": "utils"
        }

    ];
}
const buildGitLabCommits = () => {
    return [
        {
            'id': 11,
            'author_name': 'ric-flair',
            'committer_name': 'ric-flair',
            'committer_email': 'ric.flair@wcw.com'
        },
        {
            'id': 12,
            'author_name': 'goldberg',
            'committer_name': 'goldberg',
            'committer_email': 'goldberg@wcw.com'
        }
    ];
}
const getGitLabDiffList = () => {
    return [
        {
            "diff": "@@ -71,6 +71,8 @@\n sudo -u git -H bundle exec rake..",
            "new_path": "doc/update/5.4-to-6.0.md",
            "old_path": "doc/update/5.4-to-6.0.md"
        },
        {
            "diff": "@@ -11,2 exec rake..",
            "new_path": "gradlew",
            "old_path": "gradlew"
        }
    ];
}

test('testing to get the GitLab projects', async () => {
    const gitLabProjects = buildGitLabProjects();
    const all = jest.fn().mockImplementation(() => {
        return gitLabProjects;
    });
    const gitLabApi = {
        Projects: {
            all: all
        }
    };
    const path = '/acme';

    const projects = await getGitLabProjects(gitLabApi, path);

    expect(all).toHaveBeenCalledTimes(1);
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
});

test('testing to get the GitLab commits', async () => {
    const gitLabCommits = buildGitLabCommits();
    const all = jest.fn().mockImplementation(() => {
        return gitLabCommits;
    });
    const gitLabApi = {
        Commits: {
            all: all
        }
    };
    const branch = 'master';
    const projectId = '333';

    const commits = await getGitLabCommits(gitLabApi, projectId, branch);

    expect(all).toHaveBeenCalledTimes(1);
    expect(commits.length).toBe(2);
    for(let i=0; i < 2; i++) {
        expect(commits[i].id).toBe(gitLabCommits[i].id);
        expect(commits[i].committer_name).toBe(gitLabCommits[i].committer_name);
        expect(commits[i].committer_email).toBe(gitLabCommits[i].committer_email);
    }

    expect(all).toHaveBeenCalledTimes(1);
    expect(all).toHaveBeenCalledWith(projectId, { ref_name: branch });
});

test('testing to get the GitLab diffs', async () => {
    const gitLabDiff = getGitLabDiffList();
    const diff = jest.fn().mockImplementation(() => {
        return gitLabDiff;
    });
    const gitLabApi = {
        Commits: {
            diff: diff
        }
    };
    const commitId = '738479';
    const projectId = '333';

    const diffs = await getGitLabDiffList(gitLabApi, projectId, commitId);

    expect(diff).toHaveBeenCalledTimes(1);
    expect(diffs.length).toBe(2);
    for(let i=0; i < 2; i++) {
        expect(diffs[i].diff).toBe(gitLabDiff[i].diff);
        expect(diffs[i].path).toBe(gitLabDiff[i].path);
    }
});