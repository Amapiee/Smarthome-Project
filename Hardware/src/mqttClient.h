#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

class MqttClient {
private:
    // Lưu trữ thông tin mạng
    const char* ssid;
    const char* password;
    const char* broker;
    
    // Object của thư viện mạng
    WiFiClient espClient;
    PubSubClient client;

    // Hàm ẩn nội bộ: Tự động kết nối lại nếu rớt mạng
    void reconnect(); 

public:
    // Constructor: Nhận thông tin WiFi và Broker
    MqttClient(const char* wifiSsid, const char* wifiPass, const char* mqttBroker);
    
    // Các phương thức public
    void connect();
    void keepAlive();
    
    // Hàm nhận dữ liệu để đóng gói JSON và gửi đi
    void publishData(float temp, float hum, int pm25);
};

#endif