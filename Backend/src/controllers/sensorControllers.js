import Sensor from '../model/Sensor.model.js';

export const getLatestData = async (req, res) => {
    try {
        const latestData = await Sensor.findOne().sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            data: latestData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};