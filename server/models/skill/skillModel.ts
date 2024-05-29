import ProgLangModel from '../progLang/progLangModel'
import { Table, Model, Column, DataType,  PrimaryKey, ForeignKey, AutoIncrement, AllowNull, BelongsTo } from 'sequelize-typescript'

@Table({ tableName: 'skill' })
export class SkillModel extends Model {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare enabled: boolean

    @ForeignKey(() => SkillModel)
    @Column({ field: 'parent_id' })
    declare parentId: number

    @ForeignKey(() => ProgLangModel)
    @Column({ field: 'proglang_id' })
    declare progLangId: number
    
    @BelongsTo(() => ProgLangModel, {
        foreignKey: 'proglang_id',
        onDelete: 'restrict'
    })
    declare progLangRef: ProgLangModel

}