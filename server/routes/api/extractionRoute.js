const express = require('express');
const router = express.Router();
const extractionController = require('../../controllers/extractionController');

router.route('/')
    .post(extractionController.extract);

module.exports = router;