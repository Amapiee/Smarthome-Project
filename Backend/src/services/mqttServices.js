const mqtt = require('mqtt');
const AirQuality = require('../model/airdata.model');

// Demo: {"temperature": 25, "humidity": 60, "pm25": 12, "co2": 400, "dangerLevel": 1}

console.log('Connecting to:', process.env.HIVE_MQTT_URL);

const client = mqtt.connect(process.env.HIVE_MQTT_URL, {
    port: process.env.HIVE_MQTT_PORT,
    username: process.env.HIVE_MQTT_USERNAME,
    password: process.env.HIVE_MQTT_PASSWORD,
    rejectUnauthorized: false,
    reconnectPeriod: 1000, 
});

client.on('connect', () => {
    try {
        console.log('Backend successfully connected to HiveMQ!');
        client.subscribe(process.env.HIVE_MQTT_TOPIC);
    }
    catch (error) {
        console.error('Error occurred while connecting to HiveMQ:', error);
    }
});

client.on('error', (error) => {
    console.error('Error occurred with MQTT client:', error);
});

client.on('message', async (topic, message) => {
    try {
        const payload = message.toString();
        const rawData = JSON.parse(payload);
        
        const levelMap = ['SAFE', 'MODERATE', 'DANGEROUS', 'EXTREME'];
        const stringDangerLevel = levelMap[rawData.dangerLevel] || 'SAFE';

        const airQuality = new AirQuality({
            temperature: rawData.temperature,
            humidity:    rawData.humidity,
            pm25:        rawData.pm25,
            co2:         rawData.co2,
            dangerLevel: stringDangerLevel,
        });

        const savedData = await airQuality.save();

    } catch (error) {
        // Bắt mọi lỗi từ JSON parse, Validation cho đến DB connection
        console.error('[MQTT Error] Failed to process message:', error.message);
    }
});

module.exports = client;