import RepositoryModel from '../repository/repositoryModel'
import ProgLangModel from '../progLang/progLangModel'
import { Table, Model, Column, DataType,  PrimaryKey, ForeignKey, AutoIncrement, Default, BelongsTo, BelongsToMany, AllowNull } from 'sequelize-typescript'

@Table({ tableName: 'extraction' })
export class ExtractionModel extends Model {
 
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare startDate: Date

    @AllowNull(false)
    @Column(DataType.STRING)
    declare branches: string

    @Column(DataType.STRING)
    declare path: string

    @Column(DataType.STRING)
    declare status: string

    @ForeignKey(() => RepositoryModel)
    @Column({ field: 'repository_id' })
    declare repositoryId: number

    @BelongsTo(() => RepositoryModel, 'repository_id')
    declare repositoryRef: RepositoryModel

    @BelongsToMany(() => ProgLangModel, () => ExtractionProgLangModel)
    declare progLangs?: ProgLangModel[]
}

@Table({ tableName: 'extraction_proglang' })
export class ExtractionProgLangModel extends Model {

    @ForeignKey(() => ExtractionModel)
    @Column({ field: 'extraction_id' })
    declare extractionRef: number

    @ForeignKey(() => ProgLangModel)
    @Column({ field: 'proglang_id' })
    declare progLangRef: number

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
//     id: {/
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