import { Sequelize } from 'sequelize-typescript'

// const sequelize: Sequelize = new Sequelize('sqlite::memory:', {
const sequelize: Sequelize = new Sequelize({    
    dialect: "sqlite",
    storage: 'skillhunter-db.sqlite',
    define: {
        freezeTableName: true,
        timestamps: false
    },
    logQueryParameters: true
})

export default sequelize