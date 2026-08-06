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

    float tempForMQ = isnan(data.temperature) ? 25.0 : data.temperature;
    float humForMQ = isnan(data.humidity) ? 50.0 : data.humidity;

    data.co2 = mq135.getCorrectedPPM(tempForMQ, humForMQ);
    if (isnan(data.temperature) || isnan(data.humidity) || isnan(data.co2)) {
        data.isValid = false; 
        Serial.println("Error reading DHT22 or MQ135");
    }

    const int samplingTime = 280;
    const int deltaTime = 40;
    const int sleepTime = 9680;

    int analogValueGP2Y = 0;
    float calcVoltage = 0;
    float dustDensity = 0;

    digitalWrite(GP2YledPin, LOW); 
    delayMicroseconds(samplingTime); // Đợi đúng 280us

    analogValueGP2Y = analogRead(GP2YmeasurePin); 
    
    delayMicroseconds(deltaTime); // Đợi nốt 40us cho ổn định mạch
    digitalWrite(GP2YledPin, HIGH); 
    
    delayMicroseconds(sleepTime); 

    // ==========================================
    // PHẦN TOÁN HỌC: QUY ĐỔI ĐIỆN ÁP -> NỒNG ĐỘ (mg/m3)
    // ==========================================
    
    calcVoltage = analogValueGP2Y * (3.3 / 4095.0);
    Serial.print("[Debug Bụi] Raw ADC: ");
    Serial.print(analogValueGP2Y);
    Serial.print(" | Dien ap: ");
    Serial.println(calcVoltage);

    // 1. Công thức gốc ra mg/m3
    float trueSensorVoltage = calcVoltage * 3;
    float dustDensityMg = (0.17 * trueSensorVoltage) - 0.1;
    
    if (dustDensityMg < 0.0) {
        dustDensityMg = 0.0;
    }

    // 2. Đổi sang Microgram/m3 (µg/m3) để khớp với chuẩn AQI và tránh mất dữ liệu khi ép kiểu Int
    float dustDensityUg = dustDensityMg * 1000.0; 
    
    if (data.isValid) {
        dustDensityUg = DustCompensation::apply(dustDensityUg, data.temperature, data.humidity);
    }
    
    // 3. Đưa qua bộ đệm vòng để làm mượt (Lọc nhiễu gai)
    // float smoothedDustDensity = dustFilter.filter(dustDensityUg);

    data.pm25 = (int)dustDensityUg;
    
    data.dangerLevel = SAFE;

    // 4. Nếu hệ thống đọc được CO2, đưa vào luồng kiểm tra
    if (!isnan(data.co2)) {
        if (data.co2 >= 5000) data.dangerLevel = EXTREME;
        else if (data.co2 >= 2000 && data.dangerLevel < DANGEROUS) data.dangerLevel = DANGEROUS;
        else if (data.co2 >= 1000 && data.dangerLevel < MODERATE) data.dangerLevel = MODERATE;
    }

    // 5. Luôn luôn kiểm tra PM2.5 (Vì nó không trả về NaN, nó luôn có giá trị)
    // Nếu PM2.5 nguy hiểm hơn mức hiện tại do CO2 gán, thì ghi đè lên mức cao hơn
    if (data.pm25 >= 200) {
        data.dangerLevel = EXTREME; 
    } 
    else if (data.pm25 >= 100 && data.dangerLevel < DANGEROUS) {
        data.dangerLevel = DANGEROUS;
    } 
    else if (data.pm25 >= 50 && data.dangerLevel < MODERATE) {
        data.dangerLevel = MODERATE;
    }
    return data;
}