const mongoose = require('mongoose');

const AirQualitySchema = new mongoose.Schema({
    temperature: { type: Number, default: 0 },
    humidity: { type: Number, default: 0 },
    pm25: { type: Number, required: true },
    co2 : { type: Number, required: true },
    timestamp: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('AirQuality', AirQualitySchema);