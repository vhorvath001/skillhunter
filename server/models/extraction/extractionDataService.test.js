const saveExtraction = require('./extractionDataService');
const { ExtractionModel, ExtractionProgLangModel } = require('./extractionModel');

test.only('checking if all the extraction data is saved correctly', async () => {
    const extractionId = 0;

    const spyExtractionModel = jest.spyOn(ExtractionModel, 'create').mockImplementation(() => { return { id: extractionId }} );
    const spyExtractionProgLangModel = jest.spyOn(ExtractionProgLangModel, 'create').mockImplementation(() => {});

    const repoId = 422;
    const path = '/acme';
    const progLangs = [1,2];
    const branches = {'acem-service': 'release/2.1'};

    await saveExtraction(repoId, branches, path, progLangs);

    expect(spyExtractionModel).toHaveBeenCalledTimes(1);
    expect(spyExtractionModel).toHaveBeenCalledWith({
        repository_id: repoId,
        branches: JSON.stringify(branches),
        path: path
    });
    expect(spyExtractionProgLangModel).toHaveBeenCalledTimes(2);
    expect(spyExtractionProgLangModel).toHaveBeenNthCalledWith(1, {
        extraction_id: extractionId,
        proglang_id: progLangs[0]
    });
    expect(spyExtractionProgLangModel).toHaveBeenNthCalledWith(2, {
        extraction_id: extractionId,
        proglang_id: progLangs[1]
    });
})