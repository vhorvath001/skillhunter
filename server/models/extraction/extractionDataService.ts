import { Op } from 'sequelize'
import logger from '../../init/initLogger'
import RepositoryModel from '../repository/repositoryModel'
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
        path: path,
        status: 'IN PROGRESS'
    }, {
        include: RepositoryModel
    });

    for (const progLang of progLangs) {
        await ExtractionProgLangModel.create({
            extractionRef: extraction.id,
            progLangRef: progLang
        });
    }
    return extraction.id;
}

const updateStatus = async(extractionId: number, status: string) => {
    await ExtractionModel.update(
        { status: status },
        {
            where: {
                id: extractionId
            }
        }
    )
}

    const getExtractionModels = async (repoId: number, status: string, filterFrom: Date, filterTo: Date): Promise<ExtractionModel[]> => {
        return await ExtractionModel.findAll({
            where: { 
                repositoryRef: repoId,
                status: status,
                startDate: {
                    [Op.between]: [filterFrom, filterTo]
                }
            }
        })
        return []
    }

export { saveExtraction, updateStatus, getExtractionModels }