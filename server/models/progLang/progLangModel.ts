import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsToMany } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'proglang' })
export default class ProgLangModel extends Model<InferAttributes<ProgLangModel>, InferCreationAttributes<ProgLangModel>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare name: string

    @Attribute(DataTypes.STRING)
    declare desc: CreationOptional<string>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare sourceFiles: string

    @Attribute(DataTypes.INTEGER)
    declare level: CreationOptional<number>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare patterns: string

    @Attribute(DataTypes.STRING)
    @NotNull
    declare scopePattern: string

    @Attribute(DataTypes.STRING)
    declare packageSeparator: CreationOptional<string>

    @Attribute(DataTypes.BOOLEAN)
    declare removingTLDPackages: boolean

    // @BelongsToMany(() => ExtractionModel, { through: 'ExtractionProgLangModel' })
    // declare extractions: ExtractionModel[]
    
}