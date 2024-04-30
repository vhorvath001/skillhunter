import { AxiosInstance, AxiosResponse } from 'axios'
import { ProjectSchema, CommitSchema, CommitDiffSchema, RepositoryTreeSchema } from '../schema/gitlabSchema'
import logger from '../init/initLogger'

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

const getGitLabProjects = async (gitLabApi: AxiosInstance, path: string): Promise<GitLabProjectType[]> => {
    logger.debug(`Getting GitLab projects [path=${path}] ...`)

    const projects: ProjectSchema[] = await getAll('projects', gitLabApi)

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
    logger.debug(gitLabProjects)

    return gitLabProjects
}

const getGitLabCommits = async (gitLabApi: AxiosInstance, projectId: number, branch: string): Promise<GitLabCommitType[]> => {
    logger.debug(`Getting GitLab commits [projectId=${projectId}, branch=${branch}] ...`)

    const commits: CommitSchema[] = await getAll(`/projects/${projectId}/repository/commits`, gitLabApi, { 'ref_name': branch } )

    const gitLabCommits: GitLabCommitType[] = commits
        .map(c => { return {
            id: c.id,
            committer_name: c.committer_name,
            committer_email: c.committer_email
        }})
    logger.debug(gitLabCommits)

    return gitLabCommits
}

const getGitLabDiffList = async (gitLabApi: AxiosInstance, projectId: number, commitId: string): Promise<GitLabDiff[]> => {
    logger.debug(`Getting GitLab diffs [projectId=${projectId}, commitId=${commitId}] ...`)

    const diff: CommitDiffSchema[] = await getAll(`/projects/${projectId}/repository/commits/${commitId}/diff`, gitLabApi)

    const gitLabDiffs: GitLabDiff[] = diff.map(d => { return {
        diff: d.diff,
        path: d.new_path
    }})
    logger.debug(gitLabDiffs)

    return gitLabDiffs
}

const getGitLabContentByCommitId = async (gitLabApi: AxiosInstance, projectId: number, filePath: string, commitId: string): Promise<string> => {
    logger.debug(`Getting GitLab content [projectId=${projectId}, commitId=${commitId}, filePath=${filePath}] ...`)

    const content = await gitLabApi.get(`/projects/${projectId}/repository/files/${filePath}/raw`, { params: { 'ref': commitId }})
    logger.debug(content.toString())

    return content.toString()
}

const getGitLabFolders = async (gitLabApi: AxiosInstance, projectId: number, commitId: string): Promise<string[]> => {
    logger.debug(`Getting GitLab folders [projectId=${projectId}, commitId=${commitId}] ...`)

    const repositoryTree: RepositoryTreeSchema[]  = await getAll(`/projects/${projectId}/repository/tree`, gitLabApi, { 
        'ref': commitId,
        'path': '/',
        'recursive': true})

    const folders: string[] = repositoryTree.map(f => f.path)
    logger.debug(folders)

    return folders
}

const getGitLabBranches = async (gitLabApi: AxiosInstance, projectId: number) => {
    logger.debug(`Getting GitLab branches of a project [projectId=${projectId}] ...`)

    const branches: any[]  = await getAll(`/projects/${projectId}/repository/branches`, gitLabApi, { 
        'sort': 'updated_desc'})

    const result: string[] = branches.map(b => b.name)
    logger.debug(result)

    return result
}

const getAll = async (resource: string, client: AxiosInstance, queryParams: {} = {}): Promise<any[]> => {
    const allResult: any[] = []
    let page: number = 1
    const perPage = 100
    let result: any[] = [...Array(100).keys()]

    while (result.length === perPage) {
        const response: AxiosResponse = await client.get(resource, {
            params: {
                'page': page++,
                'per_page': perPage,
                queryParams
            }
        })
        if (response && response.data.length > 0) {
            result = response.data
            allResult.push(...result)
        } else
            result = []
    }
    return allResult
}

export { getGitLabProjects, getGitLabCommits, getGitLabDiffList, getGitLabContentByCommitId, getGitLabFolders, getGitLabBranches, 
         GitLabProjectType, GitLabCommitType, GitLabDiff }