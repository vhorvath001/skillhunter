import logger from './initLogger';
import sequelize from './initSequelize'
// import ProgLangModel from '../models/progLang/progLangModel'
// import RepositoryModel from '../models/repository/repositoryModel'

const initDB = async (): Promise<void> => {
    logger.info('Initialising the database...')
    await sequelize.sync()
    logger.info('Synchronization was successful!')
    // await ProgLangModel.create({
    //     id: 1,
    //     name: 'Java'
    // });
    // await ProgLangModel.create({
    //     id: 2,
    //     name: 'Python'
    // });
    // await RepositoryModel.create({
    //     id: 1,
    //     name: 'Gitlab'
    // });
}


export default initDB