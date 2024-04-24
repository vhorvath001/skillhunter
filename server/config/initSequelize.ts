import { Sequelize } from '@sequelize/core'

const sequelize: Sequelize = new Sequelize('sqlite::memory:', {
    dialect: "sqlite",
    define: {
        freezeTableName: true
    },
    logQueryParameters: true
})

export default sequelize