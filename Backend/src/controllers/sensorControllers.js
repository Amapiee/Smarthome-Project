const AirQuality = require('../model/airdata.model');
const client = require('../services/mqttServices');

const getLatestData = async (req, res) => {
    try {
        const latestData = await AirQuality.findOne().sort({ timestamp: -1 }).select('-_id -__v -dangerLevel -timestamp');
        res.status(200).json({
            success: true,
            data: latestData
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getDangerLevel = async (req, res) => {
    try {
        const data = await AirQuality.findOne().
        sort({ timestamp: -1 }).select('-_id dangerLevel');
        if(!data){
            return res.status(404).json({ success: false, message: 'No data found' });
        }

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getChartData = async (req, res) => {
    try {
        const data = await AirQuality.find()
        .sort({ timestamp: -1 })
        .limit(20).select('-_id temperature humidity pm25 co2 timestamp ');
        
        res.status(200).json({
            success: true,
            data: data.reverse(),
        });
    } catch (error) {
        console.error("Error from getChartData:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getHistoryData = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const historyData = await AirQuality.find().sort({ timestamp: -1 }).limit(limit).select('-__v -dangerLevel');
        res.status(200).json({
            success: true,
            data: historyData
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



module.exports = {
    getLatestData,
    getChartData,
    getHistoryData,
    getDangerLevel,
};