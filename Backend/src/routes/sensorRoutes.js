const getLatestData = require('../controllers/sensorControllers').getLatestData;
const getHistoryData = require('../controllers/sensorControllers').getHistoryData;
const getChartData = require('../controllers/sensorControllers').getChartData;
const express = require('express');

const router = express.Router();

router.get('/latest', getLatestData);
router.get('/history', getHistoryData);
router.get('/chart', getChartData); 

module.exports = router;