import { Request, Response } from 'express'
import logger from '../init/initLogger'
import ProgLangModel from '../models/progLang/progLangModel'
import { ProgLangType } from '../schema/appTypes'
import { deleteProgLangById, getAllProgLangsOrderByName, getProgLangById, saveProgLang, updateProgLang } from '../models/progLang/progLangDataService'
import { getErrorMessage, logError } from './commonFunctions'

const getProgLang = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get a programming language - id: ${req.params.id}`)

    try {
        const id: number = Number(req.params.id)
        const progLangModel: ProgLangModel | null = await getProgLangById(id)

        if (!progLangModel) {
            resp.status(404).send({'message': `The programming language [${id}] cannot be found in database!`})
        } else {
            resp.status(200).json(toProgLangType(progLangModel))
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'getProgLangById'.`)
        resp.status(500).send({'message': `Error occurred when trying to get a programming language! - ${getErrorMessage(err)}`})
    }
}

const getAllProgLangs = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get all the programming languages.`)

    try {
        const progLangModels: ProgLangModel[] = await getAllProgLangsOrderByName()

        resp.status(200).json(
            progLangModels.map(m => toProgLangType(m))
        )
    } catch(err) {
        logError(err, `Error occurred when executing 'getAllProgLangs'.`)
        resp.status(500).send({'message': `Error occurred when trying to get all the programming languages! - ${getErrorMessage(err)}`})
    }
}

const createNewProgLang = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to create a new programming language. - ${JSON.stringify(req.body)}`)
    
    try {
        const newProgLang = req.body as ProgLangType

        const newProgLangModel = await saveProgLang(toProgLangModel(newProgLang))

        resp.status(201).json(toProgLangType(newProgLangModel))
    } catch(err) {
        logError(err, `Error occurred when executing 'createNewProgLang'.`)
        resp.status(500).send({'message': `Error occurred when trying to save a new programming languages! - ${getErrorMessage(err)}`})
    }
}

const editExistingProgLang = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to edit an existing programming language. - ${JSON.stringify(req.body)}`)

    try {
        const toUpdateProgLang = req.body as ProgLangType        
        const id: number = Number(req.params.id)

        const toUpdateProgLangModel: ProgLangModel = toProgLangModel(toUpdateProgLang)
        const cnt = await updateProgLang(toUpdateProgLangModel, id)
        logger.info(`${cnt[0]} row(s) was/were updated.`)

        if (!cnt || cnt[0] === 0) {
            resp.status(404).send({'message': `The programming language [${id}] cannot be found in database!`})
        } else {
            resp.status(201).json(toProgLangType(toUpdateProgLangModel))
        }
    } catch(err) {
        logError(err, `Error occurred when executing 'editExistingProgLang'.`)
        resp.status(500).send({'message': `Error occurred when trying to edit an existing programming language! - ${getErrorMessage(err)}`})
    }
}

const deleteProgLang = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to delete a programming language - id: ${req.params.id}`)

    try {
        const id: number = Number(req.params.id)
        const deletedRows: number = await deleteProgLangById(id)

        if (deletedRows !== 1)
            resp.status(404).send({'message': `The programming language [${id}] cannot be found in database!`})
        else
            resp.sendStatus(200)
    } catch(err) {
        logError(err, `Error occurred when executing 'deleteProgLang'.`)
        resp.status(500).send({'message': `Error occurred when trying to delete a programming language! - ${getErrorMessage(err)}`})
    }
}

const toProgLangType = (progLangModel: ProgLangModel): ProgLangType => {
    return {
        id: progLangModel.id,
        name: progLangModel.name,
        desc: progLangModel.desc,
        sourceFiles: progLangModel.sourceFiles,
        level: progLangModel.level,
        packageSeparator: progLangModel.packageSeparator,
        removingTLDPackages: progLangModel.removingTLDPackages,
        patterns: progLangModel.patterns ? JSON.parse(progLangModel.patterns).patternList : [],
        ignoringLinesPatterns: progLangModel.ignoringLinesPatterns ? JSON.parse(progLangModel.ignoringLinesPatterns).patternList : [],
        packageRemovalPatterns: progLangModel?.packageRemovalPatterns ? JSON.parse(progLangModel.packageRemovalPatterns).patternList : [],
        scope: progLangModel.scopePattern,
        ranking: progLangModel?.ranking ? JSON.parse(progLangModel.ranking).patternList : []
    }
}

const toProgLangModel = (progLang: ProgLangType): ProgLangModel => {
    const progLangModel = ProgLangModel.build({
        name: progLang.name,
        desc: progLang.desc,
        sourceFiles: progLang.sourceFiles,
        level: progLang.level,
        patterns: JSON.stringify({ patternList: progLang.patterns }),
        packageRemovalPatterns: JSON.stringify({ patternList: progLang.packageRemovalPatterns }),
        ignoringLinesPatterns: JSON.stringify({ patternList: progLang.ignoringLinesPatterns }),
        scopePattern: progLang.scope,
        packageSeparator: progLang.packageSeparator,
        removingTLDPackages: progLang.removingTLDPackages,
        ranking: JSON.stringify({ patternList: progLang.ranking }),
    })
    if (progLang.id)
        progLangModel.id = Number(progLang.id)
    return progLangModel
}

export { getProgLang, getAllProgLangs, createNewProgLang, editExistingProgLang, deleteProgLang, toProgLangType }