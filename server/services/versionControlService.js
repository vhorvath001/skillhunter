
const getGitLabProjects = async (gitLabApi, path) => {
    const projects = await gitLabApi.Projects.all();
    // TODO path_with_namespace can be null
    return projects
            .filter(p => (p.path_with_namespace.startsWith('/') ? p.path_with_namespace : '/'+p.path_with_namespace).startsWith(path))
            .map(p => { return {
                id: p.id,
                name: p.name,
                description: p.description,
                path_with_namespace: p.path_with_namespace,
                created_at: p.created_at,
                http_url_to_repo: p.http_url_to_repo,
                last_activity_at: p.last_activity_at
            }});
}

const getGitLabCommits = async (gitLabApi, projectId, branch) => {
    const commits = await gitLabApi.Commits.all(projectId, { ref_name: branch });
    return commits
        .map(c => { return {
            id: c.id,
            committer_name: c.committer_name,
            committer_email: c.committer_email
        }});
}

const getGitLabDiffList = async (gitLabApi, projectId, commitId) => {
    const diff = await gitLabApi.Commits.diff(projectId, commitId);
    return diff.map(d => { return {
        diff: d.diff,
        path: d.new_path
    }});
}

const getGitLabContentByCommitId = async (gitLabApi, projectId, filePath, commitId) => {
    const content = await gitLabApi.RepositoryFiles.showRaw(projectId, filePath, { ref: commitId });
    return content;
}

const getGitLabFolders = async (projectId, commitId) => {
    let size = 500;
    let folders = [];
    while (size === 500) {
        const _folders = await gitLabApi.Repositories.tree(
            projectId, 
            '/', 
            {
                recursive: true, 
                ref: commitId,  
                page: (Math.floor(folders.length / 500)) + 1, 
                per_page: 500 
            }
        );
        size = _folders.length;
        if (_folders)
            folders.push(..._folders);
    }
    
    return folders.map(f => f.path);
}

module.exports = { getGitLabProjects, getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId, getGitLabFolders };