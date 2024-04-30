import { Request, Response } from 'express'
import { start } from '../services/extractionService'
import logger from '../config/initLogger'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* 
incoming body values:
   * repoId: the DB id of the repository
   * path: what to analyse inside the repo specified above (e.g. '/cqs')
   * progLangs: the DB ids of programming languages to examine in GitLab projects
   * branches: which GitLab branch has to be processed per projects
        it contains all the GitLab projects (it contains the GitLab project id) and for each project the GitLab branch is specified which is used to get the commits, ...
        { '464': 'release/1.22.1', '450': 'master, ... }
*/
const extract = async (req: Request, resp: Response) => {
    // checking the mandatory elements
    logger.info(`Request has arrived to start a repository extraction.`)

    if (!req?.body?.repoId || typeof req.body.repoId !== 'number')
        return resp.status(422).json({ 'message': 'Repository ID is not provided or invalid.' })  // Unprocessable Entity
    if (!req?.body?.path) 
        return resp.status(422).json({ 'message': 'Path is not provided.' });
    if (!req?.body?.progLangs) 
        return resp.status(422).json({ 'message': 'Programming langague array is not provided.' });
    if (!req?.body?.branches) 
        return resp.status(422).json({ 'message': 'The project - branch assignments are not provided.' });

    start(Number(req.body.repoId), 
          req.body.branches as Object, 
          req.body.path as string, 
          req.body.progLangs as number[])

    resp.sendStatus(201);
}

export default extract