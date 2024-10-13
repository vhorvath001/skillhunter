import { ProjectSchema, CommitSchema, CommitDiffSchema, RepositoryTreeSchema } from '../schema/gitlabSchema'
import logger from '../init/initLogger'
import GitlabAPI from '../init/gitlabAPI'

type GitLabProjectType = {
    id: number,
    name: string,
    description: string,
    path_with_namespace: string,
    created_at: string,
    http_url_to_repo: string,
    last_activity_at: string
}

type GitLabCommitType = {
    id: string,
    committer_name: string | undefined,
    committer_email: string | undefined
}

type GitLabDiff = {
    diff: string,
    path: string
}

const getGitLabProjects = async (gitlabAPI: GitlabAPI, path: string): Promise<GitLabProjectType[]> => {
    logger.debug(`Getting GitLab projects [path=${path}] ...`)

    const projects: ProjectSchema[] = await getAll('projects', gitlabAPI, { 'order_by' : 'name', 'sort': 'asc' })

    // TODO path_with_namespace can be null
    const gitLabProjects: GitLabProjectType[] = projects
        .filter(p => (p.path_with_namespace.startsWith('/') ? p.path_with_namespace : '/'+p.path_with_namespace).startsWith(path))
        .map(p => { return {
            id: p.id,
            name: p.name,
            description: p.description,
            path_with_namespace: p.path_with_namespace,
            created_at: p.created_at,
            http_url_to_repo: p.http_url_to_repo,
            last_activity_at: p.last_activity_at
        }})

    return gitLabProjects
}

const getGitLabProject = async (gitlabAPI: GitlabAPI, id: string): Promise<GitLabProjectType> => {
    logger.debug(`Getting GitLab project [id=${id}] ...`)

    const project = await gitlabAPI.call(`/projects/${id}`, {}) as ProjectSchema

    return {
        id: project.id,
        name: project.name,
        description: project.description,
        path_with_namespace: project.path_with_namespace,
        created_at: project.created_at,
        http_url_to_repo: project.http_url_to_repo,
        last_activity_at: project.last_activity_at
    }
}

const getGitLabCommits = async (gitlabAPI: GitlabAPI, 
                                projectId: number, 
                                branch: string,
                                nrOfCommitsType: string,
                                nrOfCommits: string|undefined,
                                nrOfCommitsTypeBetweenFrom: string|undefined,
                                nrOfCommitsTypeBetweenTo: string|undefined): Promise<GitLabCommitType[]> => {
    logger.debug(`Getting GitLab commits [projectId=${projectId}, branch=${branch}], nrOfCommitsType=[${nrOfCommitsType}], nrOfCommits=[${nrOfCommits}], nrOfCommitsTypeBetweenFrom=[${nrOfCommitsTypeBetweenFrom}], nrOfCommitsTypeBetweenTo=[${nrOfCommitsTypeBetweenTo}] ...`)

    let commitFilter: any = {}
    if (nrOfCommitsType === 'BETWEEN') {
        if (nrOfCommitsTypeBetweenFrom)
            commitFilter['since'] = nrOfCommitsTypeBetweenFrom
        if (nrOfCommitsTypeBetweenTo)
            commitFilter['until'] = nrOfCommitsTypeBetweenTo
    }
    const commits: CommitSchema[] = await getAll(`/projects/${projectId}/repository/commits`, 
                                                 gitlabAPI, 
                                                 { 'ref_name': branch,  ...commitFilter },
                                                 nrOfCommitsType === 'LAST' ? Number(nrOfCommits) : null)

    const gitLabCommits: GitLabCommitType[] = commits
        .map(c => { return {
            id: c.id,
            committer_name: c.committer_name,
            committer_email: c.committer_email
        }})

    return gitLabCommits
}

const getGitLabDiffList = async (gitlabAPI: GitlabAPI, projectId: number, commitId: string): Promise<GitLabDiff[]> => {
    logger.debug(`Getting GitLab diffs [projectId=${projectId}, commitId=${commitId}] ...`)

    const diff: CommitDiffSchema[] = await getAll(`/projects/${projectId}/repository/commits/${commitId}/diff`, gitlabAPI)

    const gitLabDiffs: GitLabDiff[] = diff
        .filter(d => !d.deleted_file)
        .filter(d => !d.renamed_file)
        .map(d => { return {
            diff: d.diff,
            path: d.new_path
        }})

    return gitLabDiffs
}

const getGitLabContentByCommitId = async (gitlabAPI: GitlabAPI, projectId: number, filePath: string, commitId: string): Promise<string> => {
    logger.debug(`Getting GitLab content [projectId=${projectId}, commitId=${commitId}, filePath=${filePath}] ...`)

    const encodedFilePath: string = encodeURIComponent(filePath)

    const content = await gitlabAPI.call(`/projects/${projectId}/repository/files/${encodedFilePath}/raw`, { 'ref': commitId }, 'text/plain') as string

    return content
}

const getGitLabFolders = async (gitlabAPI: GitlabAPI, projectId: number, commitId: string): Promise<string[]> => {
    logger.debug(`Getting GitLab folders [projectId=${projectId}, commitId=${commitId}] ...`)

    const repositoryTree: RepositoryTreeSchema[]  = await getAll(`/projects/${projectId}/repository/tree`, gitlabAPI, { 
        'ref': commitId,
        'path': '/',
        'recursive': true})

    const folders: string[] = repositoryTree.map(f => f.path)

    return folders
}

const getGitLabBranches = async (gitlabAPI: GitlabAPI, projectId: number) => {
    logger.debug(`Getting GitLab branches of a project [projectId=${projectId}] ...`)

    const branches: any[]  = await getAll(`/projects/${projectId}/repository/branches`, gitlabAPI, { 
        'sort': 'updated_desc'
    })

    const result: string[] = branches.map(b => b.name)

    return result
}

const getAll = async (resource: string, 
                      gitLabApi: GitlabAPI, 
                      queryParams: {} = {},
                      _maxRows?: number | null): Promise<any[]> => {
    let maxRows = _maxRows ? _maxRows : 9999999999999
    const allResult: any[] = []
    let page: number = 1
    const perPage = 300
    let result: any[] = [...Array(perPage).keys()]

    while (result.length === perPage) {
        result = await gitLabApi.call(resource, {
            'page': String(page++),
            'per_page': String(maxRows > perPage ? perPage : maxRows),
            ...queryParams
        }) as any[]
        if (result && result.length > 0) {
            allResult.push(...result)
        } else
            result = []
        maxRows = maxRows - perPage
    }
    return allResult
}

export { getGitLabProjects, getGitLabProject, getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId, getGitLabFolders, getGitLabBranches, GitLabProjectType, GitLabCommitType, GitLabDiff }