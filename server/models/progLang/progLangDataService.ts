import ProgLangModel from './progLangModel';

const getAllProgLangsOrderByName = async (): Promise<ProgLangModel[]> => {
    return await ProgLangModel.findAll({
        order: ['name']
    })
}

export { getAllProgLangsOrderByName }