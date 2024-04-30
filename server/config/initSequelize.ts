import { Sequelize } from '@sequelize/core'

// const sequelize: Sequelize = new Sequelize('sqlite::memory:', {
const sequelize: Sequelize = new Sequelize({    
    dialect: "sqlite",
    storage: 'skillhunter-db.sqlite',
    define: {
        freezeTableName: true
    },
    logQueryParameters: true
})

export default sequelize