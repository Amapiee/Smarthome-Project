#include "mqttClient.h"
#include <ArduinoJson.h> // Hỗ trợ đóng gói gói tin JSON

// Constructor: Khởi tạo thông tin và liên kết các đối tượng lớp mạng
MqttClient::MqttClient(const char* wifiSsid, const char* wifiPass, const char* mqttBroker) {
    ssid = wifiSsid;
    password = wifiPass;
    broker = mqttBroker;
    
    // Liên kết khối Wifi bảo mật vào Client MQTT
    client.setClient(espClient);
}

void MqttClient::connect() {
    espClient.setInsecure(); // Bỏ qua xác thực SSL (nếu dùng MQTTs) - Lưu ý: Chỉ nên dùng trong môi trường phát triển
    // 1. Tiến hành kết nối WiFi
    Serial.println();
    Serial.print("Chuan bi ket noi den mang: ");
    Serial.println(ssid);
    
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("");
    Serial.println("-> WiFi da duoc ket noi thanh cong!");
    Serial.print("-> Dia chi IP cua ESP32: ");
    Serial.println(WiFi.localIP());

    // 2. Cấu hình máy chủ MQTT Broker 
    client.setServer(broker, 8883);
    
    // 3. Thực hiện kích hoạt luồng kết nối vào Broker
    reconnect();
}

// Hàm xử lý kết nối lại ngầm khi bị mất liên lạc
void MqttClient::reconnect() {
    // Vòng lặp giữ chân cho đến khi kết nối thành công broker
    while (!client.connected()) {
        Serial.print("Dang thu ket noi den MQTT Broker...");
        
        // Tạo một Client ID ngẫu nhiên để tránh xung đột trên Broker đám mây
        String clientId = "ESP32-SmartHome-";
        clientId += String(random(0, 9999));
        
        // Thực hiện lệnh kết nối của thư viện PubSubClient
        if (client.connect(clientId.c_str(), "NhatHuy", "Huyminh0609")) {
            Serial.println("thanh cong!");
            client.subscribe("smarthome/device/fan");
            Serial.println("-> Da Subscribe vao topic: smarthome/device/fan");
        } else {
            Serial.print("that bai, ma loi rc = ");
            Serial.print(client.state());
            Serial.println(". Thu lai sau 5 giay...");
            delay(5000);
        }
    }
}

// Duy trì trạng thái kết nối ổn định trong vòng lặp chính
void MqttClient::keepAlive() {
    // 1. Kiểm tra trạng thái kết nối WiFi trước
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("-> [Network Error] Mat ket noi WiFi! Dang cho ket noi lai...");
        return; 
    }

    // 2. Kiểm tra trạng thái MQTT Client
    if (!client.connected() || client.state() != 0) {
        Serial.print("-> [MQTT Warning] Phat hien ket noi ao (State: ");
        Serial.print(client.state());
        Serial.println("). Tien hanh reconnect...");
        
        reconnect();
    }
    client.loop(); 
}

// Đăng ký hàm xử lý sự kiện (Callback) khi có gói tin điều khiển đổ về
void MqttClient::setCallback(MQTT_CALLBACK_SIGNATURE) {
    client.setCallback(callback);
}

// Đóng gói dữ liệu cấu trúc thành chuỗi JSON và Publish lên Cloud
void MqttClient::publishData(float temp, float hum, int pm25, float co2, DangerLevel dangerLevel) {
    if (!client.connected()) return;

    // Sử dụng ArduinoJson v7 để cấp phát động gói tin
    JsonDocument doc;
    
    // Ánh xạ dữ liệu thô vào các trường JSON tương ứng
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["pm25"] = pm25;
    doc["co2"] = co2;
    
    // Ép kiểu enum DangerLevel thành số nguyên (int) để truyền đi an toàn qua chuỗi
    doc["dangerLevel"] = (int)dangerLevel;

    // Tiến hành tuần tự hóa (Serialization) tạo chuỗi ký tự JSON
    char buffer[256];
    serializeJson(doc, buffer);

    // Tiến hành phát tán dữ liệu lên Topic quy định
    bool result = client.publish("smarthome/sensor/air", buffer);
    
    if (result) {
        Serial.print("-> [MQTT Publish] Gui tin nhan thanh cong: ");
        Serial.println(buffer);
    } else {
        Serial.println("-> [MQTT Error] Gui tin nhan that bai!");
    }
}