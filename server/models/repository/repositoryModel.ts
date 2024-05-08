import { Table, Model, Column, DataType,  PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript'

@Table({ tableName: 'repository' })
export default class RepositoryModel extends Model {
    
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string

    @Column(DataType.STRING)
    declare desc: string

    @AllowNull(false)
    @Column(DataType.STRING)
    declare host: string

    @AllowNull(false)
    @Column(DataType.STRING)
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
