#include "airSensor.h"

AirSensor::AirSensor(uint8_t dhtPin, uint8_t dhtType, uint8_t mq135Pin, uint8_t gp2YledPin, uint8_t gp2YmeasurePin)
    : dht(dhtPin, dhtType), mq135(mq135Pin), GP2YledPin(gp2YledPin), GP2YmeasurePin(gp2YmeasurePin) {
}

void AirSensor::begin() {
    dht.begin();

    pinMode(GP2YledPin, OUTPUT);
    
    digitalWrite(GP2YledPin, HIGH); // Tắt đèn LED của cảm biến bụi khi khởi động
}

SensorData AirSensor::readAll() {
    SensorData data;
    data.isValid = true;

    data.temperature = dht.readTemperature();
    data.humidity = dht.readHumidity();
    data.co2 = mq135.getCorrectedPPM(data.temperature, data.humidity);
    // Hàm isnan() kiểm tra xem dữ liệu trả về có phải là số hợp lệ không
    if (isnan(data.temperature) || isnan(data.humidity) || isnan(data.co2)) {
        data.isValid = false; 
        Serial.println("Error reading DHT22 or MQ135");
    }

    const int samplingTime = 280;
    const int deltaTime = 40;
    const int sleepTime = 9680;

    int analogValue = 0;
    float calcVoltage = 0;
    float dustDensity = 0;

    digitalWrite(GP2YledPin, LOW); 
    delayMicroseconds(samplingTime); // Đợi đúng 280us

    analogValue = analogRead(GP2YmeasurePin); 
    
    delayMicroseconds(deltaTime); // Đợi nốt 40us cho ổn định mạch
    digitalWrite(GP2YledPin, HIGH); 
    
    delayMicroseconds(sleepTime); 

    // ==========================================
    // PHẦN TOÁN HỌC: QUY ĐỔI ĐIỆN ÁP -> NỒNG ĐỘ (mg/m3)
    // ==========================================
    
    calcVoltage = analogValue * (3.3 / 4095.0);
    
    // Công thức: Nồng độ = 0.17 * Điện áp - 0.1
    dustDensity = 0.17 * calcVoltage - 0.1;

    // Ở môi trường siêu sạch, điện áp có thể quá thấp làm kết quả bị âm
    if (dustDensity < 0) {
        dustDensity = 0.00;
    }

    data.pm25 = dustDensity;
    
    // Kiểm tra xem dữ liệu có nguy hiểm không
    if(data.co2 < 1000 && data.pm25 < 50){
        data.dangerLevel = SAFE;
    } else if(data.co2 < 2000 && data.pm25 < 100){
        data.dangerLevel = MODERATE;
    } else if(data.co2 < 5000 && data.pm25 < 200){
        data.dangerLevel = DANGEROUS;
    } else {
        data.dangerLevel = EXTREME;
    }

    // Trả toàn bộ gói dữ liệu về cho main.cpp
    return data;
}