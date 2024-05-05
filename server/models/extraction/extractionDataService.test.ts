import Sequelize from '@sequelize/core';
import RepositoryModel from '../repository/repositoryModel';
import { saveExtraction } from './extractionDataService'
import { ExtractionModel, ExtractionProgLangModel } from './extractionModel'

test('checking if all the extraction data is saved correctly', async () => { 
    const sequelize = new Sequelize('sqlite::memory:')
    sequelize.addModels([RepositoryModel])

    const repoId: number = 422;
    const path: string = '/acme';
    const progLangs: number[] = [1,2];
    const branches: Object = {'acem-service': 'release/2.1'};
    const extractionId: number = 0;
    const repositoryRef = RepositoryModel.build({
        id: repoId,
        name: '-', desc: '-', host: '-', token: '-'
    })

    const spyExtractionModel = jest
        .spyOn(ExtractionModel, 'create')
        .mockImplementation(() => { return { id: extractionId }} );

    const spyExtractionProgLangModel = jest
        .spyOn(ExtractionProgLangModel, 'create')
        .mockImplementation(() => {})

    const result: number = await saveExtraction(repoId, branches, path, progLangs);

    expect(result).toBe(extractionId)
    expect(spyExtractionModel).toHaveBeenCalledTimes(1);
    expect(spyExtractionModel).toHaveBeenCalledWith({
        repositoryRef: repositoryRef,
        branches: JSON.stringify(branches),
        path: path
    }, expect.anything());
    expect(spyExtractionProgLangModel).toHaveBeenCalledTimes(2);
    expect(spyExtractionProgLangModel).toHaveBeenNthCalledWith(1, {
        extractionId: extractionId,
        progLangId: progLangs[0]
    });
    expect(spyExtractionProgLangModel).toHaveBeenNthCalledWith(2, {
        extractionId: extractionId,
        progLangId: progLangs[1]
    });
})