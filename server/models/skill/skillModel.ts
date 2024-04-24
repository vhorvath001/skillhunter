import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import ProgLangModel from '../progLang/progLangModel'
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'skill' })
export class SkillModel extends Model<InferAttributes<SkillModel>, InferCreationAttributes<SkillModel>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string

    @BelongsTo(() => SkillModel, 'parent_id')
    declare parentRef?: SkillModel
    
    @BelongsTo(() => ProgLangModel, 'proglang_id')
    declare progLangRef: ProgLangModel

}