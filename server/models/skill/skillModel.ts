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

    @Attribute(DataTypes.BOOLEAN)
    @NotNull
    declare enabled: boolean

    @BelongsTo(() => SkillModel, 'parentref')
    declare parentRef?: CreationOptional<SkillModel | null>
    
    @BelongsTo(() => ProgLangModel, 'progLangref')
    declare progLangRef: ProgLangModel

}