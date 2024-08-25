import { Sequelize } from 'sequelize-typescript'
import logger from './initLogger'

// const sequelize: Sequelize = new Sequelize('sqlite::memory:', {
const sequelize: Sequelize = new Sequelize({    
    dialect: "sqlite",
    storage: 'skillhunter-db.sqlite',
    define: {
        freezeTableName: true,
        timestamps: false
    },
    logging: msg => logger.info(msg),
    // logging: false,
    logQueryParameters: true
})

export default sequelize