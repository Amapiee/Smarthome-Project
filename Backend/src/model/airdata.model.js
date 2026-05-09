const mongoose = require('mongoose');

const AirQualitySchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    pm25: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('AirQuality', AirQualitySchema);