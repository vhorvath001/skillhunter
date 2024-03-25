const { format } = require('date-fns');
const ProgressLogModel = require('./progressLogModel');

const log = async (text, extractionId) => {
    console.log(`${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')} -- extraction id: ${extractionId} -- ${text}`);
    await ProgressLogModel.create({
        logText: text,
        extraction_id: extractionId
    });
}

module.exports = log;