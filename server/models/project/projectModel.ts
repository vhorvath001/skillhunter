import { ExtractionModel } from '../extraction/extractionModel'
import { Table, Model, Column, DataType,  PrimaryKey, ForeignKey, AutoIncrement, AllowNull, BelongsTo, Unique } from 'sequelize-typescript'

@Table({ tableName: 'project' })
export class ProjectModel extends Model {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string

    @AllowNull(true)
    @Column(DataType.STRING)
    declare desc: string

    @AllowNull(true)
    @Column(DataType.STRING)
    declare path: string

    @Column(DataType.DATE)
    declare created_at: Date

    @AllowNull(true)
    @Column(DataType.STRING)
    declare http_url_to_repo: string

    @Column(DataType.DATE)
    declare last_activity_at: Date

    @ForeignKey(() => ExtractionModel)
    @Column({ field: 'extraction_id' })
    declare extractionId: number

    @BelongsTo(() => ExtractionModel, {
        foreignKey: 'extraction_id',
        onDelete: 'cascade'
    })
    declare extractionRef: ExtractionModel

}