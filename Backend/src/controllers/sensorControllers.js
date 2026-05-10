const AirQuality = require('../model/airdata.model');

const getLatestData = async (req, res) => {
    try {
        const latestData = await AirQuality.findOne().sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            data: latestData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getChartData = async (req, res) => {
    try {
        const data = await AirQuality.find()
        .sort({ timestamp: -1 })
        .limit(20);
        
        res.status(200).json({
            success: true,
            data: data.reverse(),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getHistoryData = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const historyData = await AirQuality.find().sort({ timestamp: -1 }).limit(limit);
        res.status(200).json({
            success: true,
            data: historyData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getLatestData,
    getChartData,
    getHistoryData
};