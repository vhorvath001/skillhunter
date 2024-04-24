import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core'
import RepositoryModel from '../repository/repositoryModel'
import ProgLangModel from '../progLang/progLangModel'
import { Table, Attribute, PrimaryKey, AutoIncrement, NotNull, BelongsTo, BelongsToMany } from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'extraction' })
export class ExtractionModel extends Model<InferAttributes<ExtractionModel>, InferCreationAttributes<ExtractionModel>> {
 
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>

    @Attribute(DataTypes.STRING)
    @NotNull
    declare branches: string

    @Attribute(DataTypes.STRING)
    declare path: CreationOptional<string>

    @BelongsTo(() => RepositoryModel, 'repository_id')
    declare repositoryRef: RepositoryModel

    @BelongsToMany(() => ProgLangModel, { through: 'ExtractionProgLangModel' })
    declare progLangs?: ProgLangModel[]
}

@Table({ tableName: 'extraction_proglang' })
export class ExtractionProgLangModel extends Model<InferAttributes<ExtractionProgLangModel>> {

    declare extractionId: number
    declare progLangId: number

}

// interface ExtractionAttributes extends Model<InferAttributes<ExtractionAttributes>, InferCreationAttributes<ExtractionAttributes>> {
//     id: CreationOptional<number>,
//     branches: string,
//     path: string
// }

// interface ExtractionProgLangAttributes extends Model<InferAttributes<ExtractionProgLangAttributes>> {
//     extraction_id: number,
//     proglang_id: number
// }

// const ExtractionModel = sequelize.define<ExtractionAttributes>('Extraction', {
//     id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: DataTypes.NUMBER,
//         unique: true,
//     },
//     branches: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     path: {
//         type: DataTypes.STRING,
//         allowNull: true
//     }
// });

// const ExtractionProgLangModel = sequelize.define<ExtractionProgLangAttributes>('ExtractionProgLangCref', {
//     extraction_id: {
//         type: DataTypes.NUMBER,
//         allowNull: false
//     },
//     proglang_id: {
//         type: DataTypes.NUMBER,
//         allowNull: false
//     }
// }, { timestamps: false });

// ExtractionModel.belongsTo(RepositoryModel, { foreignKey: 'repository_id' });
// ExtractionModel.belongsToMany(ProgLangModel, { through: ExtractionProgLangModel, foreignKey: 'extraction_id' });
// ProgLangModel.belongsToMany(ExtractionModel, { through: ExtractionProgLangModel, foreignKey: 'proglang_id'});

// module.exports = { ExtractionModel, ExtractionProgLangModel };