const { start } = require('../services/extractionService');

/* 
incoming body values:
   * repoId: the DB id of the repository
   * path: what to analyse inside the repo specified above (e.g. '/cqs')
   * progLangs: the DB ids of programming languages to examine in GitLab projects
   * branches: which GitLab branch has to be processed per projects
        it contains all the GitLab projects (it contains the GitLab project id) and for each project the GitLab branch is specified which is used to get the commits, ...
        { '464': 'release/1.22.1', '450': 'master, ... }
*/
const extract = (req, resp) => {
    // checking the mandatory elements
    if (!req?.body?.repoId) return resp.status(422).json({ 'message': 'Repository ID is required.' })  // Unprocessable Entity
    if (!req?.body?.path) return resp.status(422).json({ 'message': 'Path is required.' });
    if (!req?.body?.progLangs) return resp.status(422).json({ 'message': 'Programming langague array is required.' });
    if (!req?.body?.branches) return resp.status(422).json({ 'message': 'The project - branch assignments are required.' });

    start(req.body.repoId, req.body.branches, req.body.path, req.body.progLangs);

    resp.sendStatus(201);
}

module.exports = extract