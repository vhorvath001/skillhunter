import { QueryTypes } from 'sequelize';
import sequelize from '../../init/initSequelize';
import { RankingType } from '../../schema/appTypes';
import ProgLangModel from './progLangModel';

const getAllProgLangsOrderByName = async (): Promise<ProgLangModel[]> => {
    return await ProgLangModel.findAll({
        order: ['name']
    })
}

const getAllProgLangsByExtractionIdOrderByName = async (extractionId: number|undefined): Promise<ProgLangModel[]> => {
    return await sequelize.query('SELECT DISTINCT pl.* FROM proglang AS pl, skill AS s, extraction_skill_finding AS esf WHERE pl.id = s.proglang_id AND s.id = esf.skill_id AND esf.extraction_id = :extractionId ORDER BY pl.name', {
        replacements: {
            extractionId: extractionId
        },
        model: ProgLangModel,
        mapToModel: true,
        type: QueryTypes.SELECT,
    })
}

const getProgLangsByIds = async (proglangIds: number[]): Promise<ProgLangModel[]> => {
    return await ProgLangModel.findAll({
        where: {
            id: proglangIds
        },
        order: ['name']
    })
}

const getProgLangById = async (id: number): Promise<ProgLangModel | null> => {
    return await ProgLangModel.findByPk(id)
}

const saveProgLang = async (model: ProgLangModel): Promise<ProgLangModel> => {
    return await model.save()
}

const updateProgLang = async (model: ProgLangModel, id: number): Promise<number[]> => {
    return await ProgLangModel.update(model.toJSON(), {
        where: {
            id: Number(id)
        } 
    })
}

const deleteProgLangById = async (id: number): Promise<number> => {
    return await ProgLangModel.destroy({
        where: {
            id: id
        }
    })
}

const updateRankings = async (transformedRankings: RankingType[], id: number): Promise<void> => {
    await ProgLangModel.update({
        ranking: JSON.stringify({
            'patternList': transformedRankings
        })
    }, {
        where: {
            id: id
        }
    }
)
}

export { getAllProgLangsOrderByName, getProgLangsByIds, getProgLangById, saveProgLang, updateProgLang, deleteProgLangById, updateRankings, getAllProgLangsByExtractionIdOrderByName }