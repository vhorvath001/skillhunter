import ProgLangModel from './progLangModel';

const getAllProgLangsOrderByName = async (): Promise<ProgLangModel[]> => {
    return await ProgLangModel.findAll({
        order: ['name']
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

export { getAllProgLangsOrderByName, getProgLangsByIds, getProgLangById, saveProgLang, updateProgLang, deleteProgLangById }