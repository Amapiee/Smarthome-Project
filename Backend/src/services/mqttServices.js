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

// Biến cục bộ để chống Spam Database
let lastDbSaveTime = 0;
const DB_SAVE_INTERVAL = 10000; // 10 giây

client.on('connect', () => {
    try {
        console.log('Backend successfully connected to HiveMQ!');
        client.subscribe(process.env.HIVE_MQTT_TOPIC);
        client.subscribe(process.env.HIVE_MQTT_FAN_TOPIC);
    }
    catch (error) {
        console.error('Error occurred while connecting to HiveMQ:', error);
    }
});

client.on('error', (error) => {
    console.error('Error occurred with MQTT client:', error);
});

client.on('message', async (topic, message) => {
    const payload = message.toString();
    if (topic === process.env.HIVE_MQTT_TOPIC){
        try {
            const rawData = JSON.parse(payload);
            
            const levelMap = ['SAFE', 'MODERATE', 'DANGEROUS', 'EXTREME'];
            const stringDangerLevel = levelMap[rawData.dangerLevel] || 'SAFE';

            const sanitizedData = {
                temperature: rawData.temperature ?? 0,
                humidity:    rawData.humidity ?? 0,
                pm25:        rawData.pm25 ?? 0,
                co2:         rawData.co2 ?? 0,
                dangerLevel: ['SAFE', 'MODERATE', 'DANGEROUS', 'EXTREME'][rawData.dangerLevel] || 'SAFE'
            };

            const currentTime = Date.now();
            if (currentTime - lastDbSaveTime >= DB_SAVE_INTERVAL) {
                const airQuality = new AirQuality(sanitizedData);
                await airQuality.save();
                lastDbSaveTime = currentTime;
                console.log('[DB] Đã lưu 1 bản ghi môi trường vào MongoDB');
            }

        } catch (error) {
            // Bắt mọi lỗi từ JSON parse, Validation cho đến DB connection
            console.error('[MQTT Error] Failed to process message:', error.message);
    }
    }
        else if (topic === process.env.HIVE_MQTT_FAN_TOPIC) {
        console.log(`[MQTT Info] Control command received: ${payload}`);
    }    
});

module.exports = client;