import { ExtractionModel } from '../extraction/extractionModel'
import { SkillModel } from '../skill/skillModel'
import { ProjectModel } from '../project/projectModel'
import { Table, Model, Column, DataType,  PrimaryKey, ForeignKey, AutoIncrement, AllowNull, BelongsTo} from 'sequelize-typescript'

@Table({ tableName: 'extraction_skill_finding' })
export default class ExtractionSkillFindingModel extends Model {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    declare score: number

    @ForeignKey(() => ExtractionModel)
    @Column({ field: 'extraction_id' })
    declare extractionId: number

    @ForeignKey(() => SkillModel)
    @Column({ field: 'skill_id' })
    declare skillId: number

    @ForeignKey(() => ProjectModel)
    @Column({ field: 'project_id' })
    declare projectId: number

    @BelongsTo(() => ExtractionModel, 'extraction_id')
    declare extractionRef: ExtractionModel

    @BelongsTo(() => SkillModel, 'skill_id')
    declare skillRef: SkillModel

    @BelongsTo(() => ProjectModel, 'project_id')
    declare projectRef: ProjectModel

}