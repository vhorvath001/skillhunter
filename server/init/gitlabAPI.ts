import RepositoryModel from "../models/repository/repositoryModel"
import logger from "./initLogger"
import crypto from 'crypto-js'
import config from '../config/skillHunter.config'

export default class GitlabAPI {

    private static _instance: GitlabAPI

    private _decryptedToken?: string
    private _repository?: RepositoryModel

    public static async createGitlapAPI(repoId: number): Promise<GitlabAPI> {
        logger.info('Initialising GitLab connection...')

        const repository = await RepositoryModel.findByPk(repoId)
        if (!repository)
            throw new Error(`The repository ID [${repoId}] doesn't exist in database!`)
        logger.debug(`The following repository model has found: ${JSON.stringify(repository)}`)

        this._instance = new GitlabAPI()
        this._instance._repository = repository

        this._instance._decryptedToken = crypto.AES.decrypt(repository.token, config.encryptionKey).toString(crypto.enc.Utf8)

        return this._instance
    }

    async call (resource: string, queryParams: {}, contentType: string = 'application/json'): Promise<any[] | string> {
        let url: string = this._repository!.host + 
                            (this._repository!.host.endsWith('/') ? '' : '/') +
                            resource

        if (queryParams) {
            url = url + '?' + (new URLSearchParams(queryParams)).toString()
        }
        logger.debug(`Calling the resource [${resource}] with params [${JSON.stringify(queryParams)}]. The crafted URL: ${url}`)

        const resp: Response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                Accept: contentType,
                'PRIVATE-TOKEN': this._decryptedToken!,
                'User-Agent': 'Skill Hunter 1.0'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        })
        if (resp.ok) {
            if (contentType === 'text/plain')
                return await resp.text()
            else
                return await resp.json()
        } else {
            const message = await resp.json()
            logger.info(typeof message)
            throw Error(`Error when calling Gitlab! :: ${resp.status} (${resp.statusText}) - ${JSON.stringify(message)}`)
        }

    }

}