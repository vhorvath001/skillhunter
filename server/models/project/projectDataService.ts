import logger from '../../init/initLogger'
import { GitLabProjectType } from '../../services/versionControlService'
import { ProjectModel } from './projectModel'
import { parseISO } from 'date-fns'

const saveProject = async (project: GitLabProjectType, extractionId: number) => {
    logger.debug(`Saving a project [${JSON.stringify(project)}] to DB...`)

    const projectModel = await ProjectModel.create({
        name: project.name,
        desc: project.description,
        path: project.path_with_namespace,
        created_at: parseISO(project.created_at), // 2013-09-30T13:46:02Z
        http_url_to_repo: project.http_url_to_repo,
        last_activity_at: parseISO(project.last_activity_at),
        extractionId: extractionId
    })
    return projectModel.id
}

export default saveProject