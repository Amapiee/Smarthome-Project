const mqtt = require('mqtt');

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

client.on('message', (topic, message) => {
    try {
        // Biến message là Buffer, cần toString() và parse JSON
        const data = JSON.parse(message.toString());
        console.log("Data received from ESP32:", data);
    } catch (error) {
        console.error('Error processing MQTT message:', error);
    }
});

module.exports = client;