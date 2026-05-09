const mqtt = require('mqtt');
require('dotenv').config();

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
    port: process.env.MQTT_PORT,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
});

client.on('connect', () => {
    console.log('Backend đã kết nối thành công tới HiveMQ!');
    client.subscribe(process.env.MQTT_TOPIC);
});

client.on('message', (topic, message) => {
    // Biến message là Buffer, cần toString() và parse JSON
    const data = JSON.parse(message.toString());
    console.log("Dữ liệu nhận được từ ESP32:", data);
});