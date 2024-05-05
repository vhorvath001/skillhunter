import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import { ExtractionModel } from '../extraction/extractionModel'
import { Default, Table, Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'progress_log'})
export default class ProgressLogModel extends Model<InferAttributes<ProgressLogModel>, InferCreationAttributes<ProgressLogModel>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>

    @Attribute(DataTypes.DATE)
    @Default(DataTypes.NOW)
    declare timestamp: CreationOptional<Date>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare logText: string

    @BelongsTo(() => ExtractionModel, 'extractionref')
    declare extractionRef: ExtractionModel

}