import { Request, Response } from 'express'
import logger from '../init/initLogger'
import ProgLangModel from '../models/progLang/progLangModel'
import { ProgLangType } from '../schema/appTypes'

const getProgLangById = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get a programming language - id: ${req.params.id}`)

    try {
        const id: string = req.params.id
        const progLangModel: ProgLangModel | null = await ProgLangModel.findByPk(id)

        if (!progLangModel) {
            resp.status(404).send({'message': `The programming language [${id}] cannot be found in database!`})
        } else {
            resp.status(200).json(toProgLangType(progLangModel))
        }
    } catch(err) {
        logger.error(`Error occurred when executing 'getProgLangById': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the get a programming language! - ${getErrorMessage(err)}`})
    }
}

const getAllProgLangs = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to get all the programming languages.`)

    try {
        const progLangModels: ProgLangModel[] = await ProgLangModel.findAll({
            order: ['name']
        })

        resp.status(200).json(
            progLangModels.map(m => toProgLangType(m))
        )
    } catch(err) {
        logger.error(`Error occurred when executing 'getAllProgLangs': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the get all the programming languages! - ${getErrorMessage(err)}`})
    }
}

const createNewProgLang = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to create a new programming language.`)
    logger.info(JSON.stringify(req.body))
    
    try {
        const newProgLang = req.body as ProgLangType

        const newProgLangModel = await toProgLangModel(newProgLang).save()

        resp.status(201).json(toProgLangType(newProgLangModel))
    } catch(err) {
        logger.error(`Error occurred when executing 'createNewProgLang': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the save a new programming languages! - ${getErrorMessage(err)}`})
    }
}

const editExistingProgLang = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to edit an existing programming language.`)
    logger.info(JSON.stringify(req.body))

    try {
        const toUpdateProgLang = req.body as ProgLangType        
        const id: string = req.params.id

        const toUpdateProgLangModel: ProgLangModel = toProgLangModel(toUpdateProgLang)
        const cnt = await ProgLangModel.update(toUpdateProgLangModel.toJSON(), { where: { id: Number(id) } })
        logger.info(`${cnt} row(s) was/were updated.`)

        if (!cnt || cnt[0] === 0) {
            resp.status(404).send({'message': `The programming language [${id}] cannot be found in database!`})
        } else {
            resp.status(201).json(toProgLangType(toUpdateProgLangModel))
        }
    } catch(err) {
        logger.error(`Error occurred when executing 'editExistingProgLang': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the edit an existing programming languages! - ${getErrorMessage(err)}`})
    }
}

const deleteProgLang = async (req: Request, resp: Response) => {
    logger.info(`Request has arrived to delete a programming language - id: ${req.params.id}`)

    try {
        const id: string = req.params.id
        const progLangModel: ProgLangModel | null = await ProgLangModel.findByPk(id)

        if (!progLangModel) {
            resp.status(404).send({'message': `The programming language [${id}] cannot be found in database!`})
        } else {
            progLangModel.destroy()
            resp.sendStatus(200)
        }
    } catch(err) {
        logger.error(`Error occurred when executing 'deleteProgLang': ${err}`)
        resp.status(500).send({'message': `Error occurred when trying the get a programming language! - ${getErrorMessage(err)}`})
    }
}

const toProgLangType = (progLangModel: ProgLangModel): ProgLangType => {
    return {
        id: progLangModel.id.toString(),
        name: progLangModel.name,
        desc: progLangModel.desc,
        sourceFiles: progLangModel.sourceFiles,
        level: progLangModel.level,
        packageSeparator: progLangModel.packageSeparator,
        removingTLDPackages: progLangModel.removingTLDPackages,
        patterns: JSON.parse(progLangModel.patterns).patternList,
        scope: progLangModel.scopePattern
    }
}

const toProgLangModel = (progLang: ProgLangType): ProgLangModel => {
    const newProgLangModel = ProgLangModel.build({
        name: progLang.name,
        desc: progLang.desc,
        sourceFiles: progLang.sourceFiles,
        level: progLang.level,
        patterns: JSON.stringify({ patternList: progLang.patterns }),
        scopePattern: progLang.scope,
        packageSeparator: progLang.packageSeparator,
        removingTLDPackages: progLang.removingTLDPackages
    })
    if (progLang.id)
        newProgLangModel.id = Number(progLang.id)
    return newProgLangModel
}

const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message
    else return String(err)
}
export { getProgLangById, getAllProgLangs, createNewProgLang, editExistingProgLang, deleteProgLang }