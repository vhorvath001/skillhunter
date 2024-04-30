import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'repository' })
export default class RepositoryModel extends Model<InferAttributes<RepositoryModel>, InferCreationAttributes<RepositoryModel>> {
    
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string

    @Attribute(DataTypes.STRING)
    declare desc: CreationOptional<string>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare host: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare token: string

}

// interface RepositoryAttributes extends Model<InferAttributes<RepositoryAttributes>, InferCreationAttributes<RepositoryAttributes>> {
//     id: CreationOptional<number>,
//     name: string,
//     desc: CreationOptional<string>,
//     host: string,
//     token: CreationOptional<string>
// }

// const RepositoryModel = sequelize.define<RepositoryAttributes>('Repository', {
//     id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: DataTypes.NUMBER,
//         unique: true,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     desc: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     host: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     token: {
//         type: DataTypes.STRING,
//         allowNull: true
//     }
// })

// export default RepositoryModel
