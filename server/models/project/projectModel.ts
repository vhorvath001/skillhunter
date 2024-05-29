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

    @ForeignKey(() => ExtractionModel)
    @Column({ field: 'extraction_id' })
    declare extractionId: number

    @BelongsTo(() => ExtractionModel, {
        foreignKey: 'extraction_id',
        onDelete: 'cascade'
    })
    declare extractionRef: ExtractionModel

}