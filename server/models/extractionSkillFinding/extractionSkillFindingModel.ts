import { ExtractionModel } from '../extraction/extractionModel'
import { SkillModel } from '../skill/skillModel'
import { ProjectModel } from '../project/projectModel'
import { Table, Model, Column, DataType,  PrimaryKey, ForeignKey, AutoIncrement, AllowNull, BelongsTo } from 'sequelize-typescript'
import { DeveloperModel } from '../developer/developerModel'

@Table({ 
    tableName: 'extraction_skill_finding',
    indexes: [{
        name: 'unique-extraction-skill-project-developer',
        unique: true,
        fields: ['extraction_id', 'skill_id', 'project_id', 'developer_id']
    }]
})
export default class ExtractionSkillFindingModel extends Model {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    declare score: number

    @AllowNull(false)
    @Column(DataType.INTEGER)
    declare nrOfChangedLines: number

    @ForeignKey(() => ExtractionModel)
    @Column({ field: 'extraction_id' })
    declare extractionId: number

    @ForeignKey(() => SkillModel)
    @Column({ field: 'skill_id' })
    declare skillId: number

    @ForeignKey(() => ProjectModel)
    @Column({ field: 'project_id' })
    declare projectId: number

    @ForeignKey(() => DeveloperModel)
    @Column({ field: 'developer_id' })
    declare developerId: number

    @BelongsTo(() => ExtractionModel, {
        foreignKey: 'extraction_id',
        onDelete: 'cascade'
    })
    declare extractionRef: ExtractionModel

    @BelongsTo(() => SkillModel, {
        foreignKey: 'skill_id',
        onDelete: 'restrict'    
    })
    declare skillRef: SkillModel

    @BelongsTo(() => ProjectModel, {
        foreignKey: 'project_id',
        onDelete: 'cascade'    
    })
    declare projectRef: ProjectModel

    @BelongsTo(() => DeveloperModel, {
        foreignKey: 'developer_id',
        onDelete: 'restrict'    
    })
    declare developerRef: DeveloperModel

}