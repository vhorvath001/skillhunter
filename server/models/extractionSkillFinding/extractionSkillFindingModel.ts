import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import { ExtractionModel } from '../extraction/extractionModel'
import { SkillModel } from '../skill/skillModel'
import { ProjectModel } from '../project/projectModel'
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'extraction_skill_finding' })
export default class ExtractionSkillFindingModel extends Model<InferAttributes<ExtractionSkillFindingModel>, InferCreationAttributes<ExtractionSkillFindingModel>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>

    @Attribute(DataTypes.DOUBLE)
    @NotNull
    declare score: number

    @BelongsTo(() => ExtractionModel, 'extractionref')
    declare extractionRef: ExtractionModel

    @BelongsTo(() => SkillModel, 'skillref')
    declare skillRef: SkillModel

    @BelongsTo(() => ProjectModel, 'projectref')
    declare projectRef: ProjectModel

}