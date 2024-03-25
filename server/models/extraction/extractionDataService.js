const { ExtractionModel, ExtractionProgLangModel } = require('./extractionModel');

const saveExtraction = async (repoId, branches, path, progLangs) => {
    const extraction = await ExtractionModel.create({
        repository_id: repoId,
        branches: JSON.stringify(branches),
        path: path
    });
    for (const progLang of progLangs) {
        await ExtractionProgLangModel.create({
            extraction_id: extraction.id,
            proglang_id: progLang
        });
    }
    return extraction.id;
}

// function getMethods(obj) {
//     var result = [];
//     for (var id in obj) {
//       try {
//         if (typeof(obj[id]) == "function") {
//           result.push(id + ": " + obj[id].toString());
//         }
//       } catch (err) {
//         result.push(id + ": inaccessible");
//       }
//     }
//     return result;
//   }

module.exports = { saveExtraction };