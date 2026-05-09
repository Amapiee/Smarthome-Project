#ifndef AIR_SENSOR_H
#define AIR_SENSOR_H

#include <Arduino.h>
#include <DHT.h>
#include <PMS.h>

// Đóng gói dữ liệu trả về (Giống Object trong JS)
struct SensorData {
    float temperature;
    float humidity;
    float co2;
    int pm25;
    bool isValid; // Báo hiệu đọc dữ liệu thành công hay thất bại
};

class AirSensor {
private:
    DHT dht;
    PMS pms;
    MQ135 mq135;
    HardwareSerial& pmsSerial; // Con trỏ tham chiếu đến cổng Serial của ESP32

public:
    // Constructor: Khởi tạo chân cắm khi tạo Object
    AirSensor(uint8_t dhtPin, uint8_t dhtType, uint8_t mq135Pin, HardwareSerial& serial);
    
    // Các phương thức public
    void begin();
    SensorData readAll();
};

#endif