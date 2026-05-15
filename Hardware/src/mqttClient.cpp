#include "mqttClient.h"
#include <ArduinoJson.h> 

const char* getDangerLevelString(DangerLevel level) {
    switch(level) {
        case SAFE: 
            return "SAFE";
        case MODERATE: 
            return "MODERATE";
        case DANGEROUS: 
            return "DANGEROUS";
        case EXTREME: 
            return "EXTREME";
        default: 
            return "UNKNOWN";
    }
}

// 1. Constructor: Gắn cấu hình mạng và khởi tạo PubSubClient
MqttClient::MqttClient(const char* wifiSsid, const char* wifiPass, const char* mqttBroker) 
    : ssid(wifiSsid), password(wifiPass), broker(mqttBroker), client(espClient) {
    // client(espClient) cực kỳ quan trọng: Nó báo cho thư viện MQTT biết 
    // phải dùng module WiFi nào của ESP32 để kết nối Internet.
}

// 2. Hàm kết nối WiFi và thiết lập Broker
void MqttClient::connect() {
    Serial.print("Dang ket noi WiFi: ");
    Serial.println(ssid);
    
    // Bắt đầu kết nối WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("\nWiFi da ket noi thanh cong!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    espClient.setInsecure();
    client.setServer(broker, 8883);
}

// 3. Hàm nội bộ (Private): Xử lý kết nối lại khi rớt mạng
void MqttClient::reconnect() {
    while (!client.connected()) {
        Serial.print("Dang ket noi lai MQTT Broker...");
        
        // Tạo một ID ngẫu nhiên cho client để tránh đụng độ trên Broker
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);

        // Thử kết nối
        if (client.connect(clientId.c_str())) {
            Serial.println(" Thanh cong!");
            client.subscribe("smarthome/devices/fan");
        } else {
            Serial.print(" That bai, ma loi: ");
            Serial.print(client.state());
            Serial.println(" Thu lai sau 5 giay...");
            delay(5000); 
        }
    }
}
// 4. Hàm duy trì kết nối (Gọi liên tục trong loop() của main.cpp)
void MqttClient::keepAlive() {
    if (!client.connected()) {
        reconnect();
    }
    // Hàm bắt buộc của PubSubClient để lắng nghe và gửi các gói tin liên tục
    client.loop(); 
}

// Cấu hình hàm callback
void MqttClient::setCallback(MQTT_CALLBACK_SIGNATURE) {
    client.setCallback(callback);
}

// 5. Hàm đóng gói và Publish dữ liệu
void MqttClient::publishData(float temp, float hum, int pm25, float co2, DangerLevel dangerLevel) {
    if (!client.connected()) {
        Serial.println("MQTT ngat ket noi, khong the gui du lieu!");
        return;
    }

    // Khởi tạo Document JSON (Cú pháp của ArduinoJson phiên bản 7)
    JsonDocument doc; 

    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["pm25"] = pm25;
    doc["co2"] = co2;
    doc["dangerLevel"] = getDangerLevelString(dangerLevel);
    // Chuyển đối tượng JSON thành chuỗi ký tự (Stringify)
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);

    Serial.print("Gui du lieu len HiveMQ: ");
    Serial.println(jsonBuffer);

    // Publish dữ liệu
    client.publish("smarthome/sensors/air", jsonBuffer);
}