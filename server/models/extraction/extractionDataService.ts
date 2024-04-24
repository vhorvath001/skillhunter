import logger from '../../config/initLogger';
import RepositoryModel from '../repository/repositoryModel';
import { ExtractionModel, ExtractionProgLangModel } from './extractionModel'

const saveExtraction = async (repoId: number , branches: Object, path: string, progLangs: number[]) => {
    logger.debug(`Saving an extraction [repoId = ${repoId}, branches = ${branches}, path = ${path}, progLangs = ${progLangs}] to DB...`)
    const repository = RepositoryModel.build({
        id: repoId,
        name: '-', desc: '-', host: '-', token: '-'
    })
    const extraction = await ExtractionModel.create({
        repositoryRef: repository,
        branches: JSON.stringify(branches),
        path: path
    }, {
        include: RepositoryModel
    });

    for (const progLang of progLangs) {
        await ExtractionProgLangModel.create({
            extractionId: extraction.id,
            progLangId: progLang
        });
    }
    return extraction.id;
}

// function getMethods(obj) {
//     var result = [];
//     for (var id in obj) {
//       try {
//         if (typeof(obj[id]) == "function") {
//           result.push(id + ": " + obj[id].toString());
//         }
//       } catch (err) {
//         result.push(id + ": inaccessible");
//       }
//     }
//     return result;
//   }

export default saveExtraction