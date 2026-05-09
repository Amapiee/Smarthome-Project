#include "airSensor.h"

AirSensor::AirSensor(uint8_t dhtPin, uint8_t dhtType, uint8_t mq135Pin, HardwareSerial& serial) 
    : dht(dhtPin, dhtType), mq135(mq135Pin), pmsSerial(serial), pms(serial) {
        // BODY
}

void AirSensor::begin() {
    dht.begin();
    mq135.begin();
    
    // Khởi động cổng Serial cho PMS5003 (Mặc định cảm biến bụi dùng Baudrate 9600)
    // Lưu ý: Nếu bạn đã gọi pmsSerial.begin(9600) ở hàm setup() trong main.cpp thì có thể bỏ dòng này.
    pmsSerial.begin(9600); 
}

SensorData AirSensor::readAll() {
    SensorData data;
    data.isValid = true; 

    // --- Đọc DHT22 ---
    data.temperature = dht.readTemperature();
    data.humidity = dht.readHumidity();
    data.co2 = mq135.readCO2();
    // Hàm isnan() kiểm tra xem dữ liệu trả về có phải là số hợp lệ không
    if (isnan(data.temperature) || isnan(data.humidity) || isnan(data.co2)) {
        data.isValid = false; 
        Serial.println("Error reading DHT22 or MQ135");
    }

    // --- Đọc PMS5003 ---
    PMS::DATA pmsData;
    // Hàm readUntil() sẽ chờ đến khi có luồng dữ liệu hoàn chỉnh từ cảm biến
    if (pms.readUntil(pmsData)) {
        data.pm25 = pmsData.PM_AE_UG_2_5; 
    } else {
        data.pm25 = 0;
        data.isValid = false;
        Serial.println("Error reading PMS5003");
    }

    // Trả toàn bộ gói dữ liệu về cho main.cpp
    return data;
}