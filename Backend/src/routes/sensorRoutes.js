const getLatestData = require('../controllers/sensorControllers').getLatestData;
const getHistoryData = require('../controllers/sensorControllers').getHistoryData;
const getChartData = require('../controllers/sensorControllers').getChartData;
const getDangerLevel = require('../controllers/sensorControllers').getDangerLevel;
const setFanState = require('../controllers/deviceControllers').setFanState;
const setFanSpeed = require('../controllers/deviceControllers').setFanSpeed;
const setAutoFan = require('../controllers/deviceControllers').setAutoFan;
const express = require('express');

const router = express.Router();

router.get('/latest', getLatestData);
router.get('/history', getHistoryData);
router.get('/chart', getChartData); 
router.get('/danger-level', getDangerLevel);

router.post('/fan-control', setFanState);
router.post('/fan-speed', setFanSpeed); 
router.post('/auto-fan', setAutoFan);

module.exports = router;