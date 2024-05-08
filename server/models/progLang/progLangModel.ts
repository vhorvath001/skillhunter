import { Table, Model, Column, DataType,  PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript'

@Table({ tableName: 'proglang' })
export default class ProgLangModel extends Model {

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
    declare sourceFiles: string

    @Column(DataType.INTEGER)
    declare level: number

    @AllowNull(false)
    @Column(DataType.STRING)
    declare patterns: string

    @AllowNull(false)
    @Column(DataType.STRING)
    declare scopePattern: string

    @Column(DataType.STRING)
    declare packageSeparator: string

    @Column(DataType.BOOLEAN)
    declare removingTLDPackages: boolean

    // @BelongsToMany(() => ExtractionModel, { through: 'ExtractionProgLangModel' })
    // declare extractions: ExtractionModel[]
    
}