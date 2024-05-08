import { ExtractionModel } from '../extraction/extractionModel'
import { Table, Model, Column, DataType,  PrimaryKey, ForeignKey, AutoIncrement, AllowNull, BelongsTo } from 'sequelize-typescript'

@Table({ tableName: 'project' })
export class ProjectModel extends Model {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string

    @ForeignKey(() => ExtractionModel)
    @Column({ field: 'extraction_id' })
    declare extractionId: number

    @BelongsTo(() => ExtractionModel, 'extraction_id')
    declare extractionRef: ExtractionModel

}