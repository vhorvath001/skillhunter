import RepositoryModel from '../repository/repositoryModel'
import ProgLangModel from '../progLang/progLangModel'
import { Table, Model, Column, DataType,  PrimaryKey, ForeignKey, AutoIncrement, Default, BelongsTo, BelongsToMany, AllowNull } from 'sequelize-typescript'

@Table({ tableName: 'extraction' })
export class ExtractionModel extends Model {
 
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    declare id: number

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string

    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare startDate: Date

    @AllowNull(false)
    @Column(DataType.STRING)
    declare projectsBranches: string

    @Column(DataType.STRING)
    declare path: string

    @Column(DataType.STRING)
    declare status: string

    @AllowNull(true)
    @Column(DataType.STRING)
    declare progressProjects?: string

    @AllowNull(true)
    @Column(DataType.STRING)
    declare progressCommits?: string

    @AllowNull(true)
    @Column(DataType.BOOLEAN)
    declare favourite?: boolean

    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'nr_of_commits_type'})
    declare nrOfCommitsType: string
    
    @AllowNull(true)
    @Column({ type: DataType.INTEGER, field: 'nr_of_commits'})
    declare nrOfCommits?: number
    
    @AllowNull(true)
    @Column({ type: DataType.DATE, field: 'nr_of_commits_type_between_from'})
    declare nrOfCommitsTypeBetweenFrom: Date

    @AllowNull(true)
    @Column({ type: DataType.DATE, field: 'nr_of_commits_type_between_to'})
    declare nrOfCommitsTypeBetweenTo: Date

    @ForeignKey(() => RepositoryModel)
    @Column({ field: 'repository_id' })
    declare repositoryId: number

    @BelongsTo(() => RepositoryModel, {
        foreignKey: 'repository_id',
        onDelete: 'restrict'
    })
    declare repositoryRef: RepositoryModel

    @BelongsToMany(() => ProgLangModel, () => ExtractionProgLangModel)
    declare progLangs?: ProgLangModel[]
}

@Table({ tableName: 'extraction_proglang' })
export class ExtractionProgLangModel extends Model {

    @ForeignKey(() => ExtractionModel)
    @Column({ field: 'extraction_id' })
    declare extractionId: number

    @ForeignKey(() => ProgLangModel)
    @Column({ field: 'proglang_id' })
    declare progLangId: number

    @BelongsTo(() => ExtractionModel, {
        onDelete: 'cascade'
    })
    declare extractionRef: ExtractionModel

    @BelongsTo(() => ProgLangModel, {
        onDelete: 'cascade'
    })
    declare progLangModelRef: ProgLangModel

}
