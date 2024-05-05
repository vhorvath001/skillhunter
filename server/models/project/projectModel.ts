import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import { ExtractionModel } from '../extraction/extractionModel'
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'project' })
export class ProjectModel extends Model<InferAttributes<ProjectModel>, InferCreationAttributes<ProjectModel>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string

    @BelongsTo(() => ExtractionModel, 'extractionref')
    declare extractionRef: ExtractionModel

}