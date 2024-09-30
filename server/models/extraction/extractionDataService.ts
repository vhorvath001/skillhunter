import { Op } from 'sequelize'
import logger from '../../init/initLogger'
import { ExtractionModel, ExtractionProgLangModel } from './extractionModel'
import { SelectedProjectBranchesType } from '../../schema/appTypes'
import RepositoryModel from '../repository/repositoryModel'
import ProgLangModel from '../progLang/progLangModel'

const saveExtraction = async (repoId: number, name:string, projectsBranches: SelectedProjectBranchesType[], path: string, progLangs: number[]) => {
    logger.debug(`Saving an extraction [repoId = ${repoId}, projectsBranches = ${JSON.stringify(projectsBranches)}, path = ${path}, progLangs = ${progLangs}] to DB...`)
    
    const extraction = await ExtractionModel.create({
        repositoryId: repoId,
        name: name,
        projectsBranches: JSON.stringify(projectsBranches),
        path: path,
        status: 'IN PROGRESS'
    })

    for (const progLang of progLangs) {
        await ExtractionProgLangModel.create({
            extractionId: extraction.id,
            progLangId: progLang
        });
    }
    return extraction.id;
}

const updateStatus = async (extractionId: number, status: string) => {
    logger.debug(`Updating the status of extraction [${extractionId}] to [${status} ...`)
    await ExtractionModel.update(
        { status: status },
        {
            where: {
                id: extractionId
            }
        }
    )
}

const getExtractionModels = async (extractionName: string | null, repoId: number | null, status: string | null, filterFrom: Date, filterTo: Date): Promise<ExtractionModel[]> => {
    logger.debug(`Getting extractions [extractionName = ${extractionName}, repoId = ${repoId}, status=${status}, filterFrom=${filterFrom}, filterTo=${filterTo}] ...`)
    let whereCond: {} = {
        startDate: {
            [Op.between]: [filterFrom, filterTo]
        }
    }
    if (repoId)
        whereCond = {...whereCond, 'repositoryId': repoId }
    if (status)
        whereCond = {...whereCond, 'status': status }
    if (extractionName)
        whereCond = {...whereCond, name: {
            [Op.like]: `%${extractionName}%`
        }}
    return await ExtractionModel.findAll({
        where: { 
            ...whereCond
        },
        include: [ RepositoryModel, ProgLangModel ]
    })
}

const getFavouriteExtractionModels = async (): Promise<ExtractionModel[]> => {
    logger.debug(`Getting favorite extractions ...`)
    return await ExtractionModel.findAll({
        where: { 
            favourite: true
        },
        include: [ RepositoryModel, ProgLangModel ]
    })
}

const updateProgressProjects = async (extractionId: number, current: number, all: number) => {
    logger.debug(`Updating the progress of the projects [extractionId = ${extractionId}, current=${current}, all=${all}] ...`)
    ExtractionModel.update(
        { progressProjects: `[${current} / ${all}]`},
        {
            where: {
                id: extractionId
            }
        }
    )
}

const updateProgressCommits = async (extractionId: number, current: number, all: number) => {
    logger.debug(`Updating the progress of the commits [extractionId = ${extractionId}, current=${current}, all=${all}] ...`)
    ExtractionModel.update(
        { 
            progressCommits: `[${current} / ${all}]` 
        },
        {
            where: {
                id: extractionId
            }
        }
    )
}

const deleteExtractionById = async (id: number): Promise<boolean> => {
    logger.debug(`Deleting extraction [id = ${id}] ...`)
    const deletedRows = await ExtractionModel.destroy({
        where: {
            id: id
        }
    })
    return deletedRows === 1
}

const updateExtractionById = async (id: number, data: any): Promise<boolean> => {
    logger.debug(`Updating extraction [id = ${id}, data = ${JSON.stringify(data)}] ...`)
    const affectedRows: number[] = await ExtractionModel.update(
        data,
        {
            where: {
                id: id
            }
        }
    )
    return affectedRows[0] === 1
}

const queryExtractionById = async (id: number): Promise<ExtractionModel> => {
    logger.debug(`Querying extraction by id [id = ${id}] ...`)
    const extraction: ExtractionModel|null = await ExtractionModel.findByPk(id)
    if (!extraction)
        throw new Error(`The exctraction [${id}] cannot be found!`)
    return extraction
}

export { saveExtraction, updateStatus, getExtractionModels, updateProgressProjects, updateProgressCommits, deleteExtractionById, updateExtractionById, queryExtractionById, getFavouriteExtractionModels }