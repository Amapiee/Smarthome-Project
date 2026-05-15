const client = require('../services/mqttServices');

const setFanState = async (req, res) => {
    try {
        const fanState = req.body.command;
        
        client.publish(process.env.HIVE_MQTT_FAN_TOPIC, fanState, { qos: 1 }, (err) => {
            if (err) {
                console.error('Lỗi khi gửi trạng thái quạt:', err);
                return res.status(500).json({ success: false, message: 'Lỗi gửi gói tin MQTT' });
            }
            
            // Đặt phản hồi thành công BÊN TRONG callback
            return res.status(200).json({ 
                success: true, 
                message: `Lệnh ${fanState} đã được gửi thành công` 
            });
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const setFanSpeed = async (req, res) => {
    try {
        const fanSpeed = req.body.speed;
        
        client.publish(process.env.HIVE_MQTT_FAN_SPEED_TOPIC, fanSpeed.toString(), { qos: 1 }, (err) => {
            if (err) {
                console.error('Lỗi khi gửi tốc độ quạt:', err);
                return res.status(500).json({ success: false, message: 'Lỗi gửi gói tin MQTT' });
            }

            return res.status(200).json({ 
                success: true, 
                message: `Tốc độ quạt đã được đặt thành ${fanSpeed}` 
            });
        });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    setFanState,
    setFanSpeed,
};