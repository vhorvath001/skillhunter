import { Table, Model, Column, DataType,  PrimaryKey, AutoIncrement, Unique, AllowNull } from 'sequelize-typescript'

@Table({ tableName: 'developer' })
export class DeveloperModel extends Model {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    declare email: string
    
}