#ifndef AIR_SENSOR_H
#define AIR_SENSOR_H

#include <Arduino.h>
#include <DHT.h>
#include <MQ135.h>
#include <averageAlgorithm.h>

#pragma once
enum DangerLevel{
    SAFE,
    MODERATE,
    DANGEROUS,
    EXTREME
};

struct SensorData {
    float temperature;
    float humidity;
    float co2;
    int pm25;
    DangerLevel dangerLevel;
    bool isValid;
};

class AirSensor {
private:
    DHT dht;
    MQ135 mq135;
    uint8_t GP2YledPin;
    uint8_t GP2YmeasurePin;

    MovingAverage<2> dustFilter; // Bộ lọc trung bình động cho nồng độ bụi mịn (PM2.5)

public:
    // Constructor: Khởi tạo chân cắm khi tạo Object
    AirSensor(uint8_t dhtPin, uint8_t dhtType, uint8_t mq135Pin, uint8_t gp2YledPin, uint8_t gp2YmeasurePin);
    
    // Các phương thức public
    void begin();
    SensorData readAll();
};

#endif