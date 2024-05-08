import { ExtractionModel } from '../extraction/extractionModel'
import { Table, Model, Column, DataType,  PrimaryKey, ForeignKey, AutoIncrement, Default, AllowNull, BelongsTo, } from 'sequelize-typescript'

@Table({ tableName: 'progress_log'})
export default class ProgressLogModel extends Model {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare timestamp: Date

    @AllowNull(false)
    @Column(DataType.STRING)
    declare logText: string

    @ForeignKey(() => ExtractionModel)
    @Column({ field: 'extraction_id' })
    declare extractionId: number

    @BelongsTo(() => ExtractionModel, 'extraction_id')
    declare extractionRef: ExtractionModel

}