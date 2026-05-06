#include "mqttClient.h"
#include <ArduinoJson.h> // Thư viện xử lý JSON

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

    // Thiết lập địa chỉ MQTT Broker và cổng mặc định (1883)
    client.setServer(broker, 1883);
}

// 3. Hàm nội bộ (Private): Xử lý kết nối lại khi rớt mạng
void MqttClient::reconnect() {
    // Lặp cho đến khi kết nối lại được với Broker
    while (!client.connected()) {
        Serial.print("Dang ket noi lai MQTT Broker...");
        
        // Tạo một ID ngẫu nhiên cho client để tránh đụng độ trên Broker
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX);

        // Thử kết nối
        if (client.connect(clientId.c_str())) {
            Serial.println(" Thanh cong!");
            // Nếu bạn làm thêm tính năng điều khiển thiết bị (VD: bật tắt quạt), 
            // bạn sẽ gọi client.subscribe("topic/dieu-khien") ở ngay đây.
        } else {
            Serial.print(" That bai, ma loi: ");
            Serial.print(client.state());
            Serial.println(" Thu lai sau 5 giay...");
            delay(5000); // Đợi 5 giây trước khi thử lại để tránh bị treo ESP32
        }
    }
}

// 4. Hàm duy trì kết nối (Gọi liên tục trong loop() của main.cpp)
void MqttClient::keepAlive() {
    // Nếu rớt mạng thì tự động nối lại
    if (!client.connected()) {
        reconnect();
    }
    // Hàm bắt buộc của PubSubClient để lắng nghe và gửi các gói tin liên tục
    client.loop(); 
}

// 5. Hàm đóng gói và Publish dữ liệu
void MqttClient::publishData(float temp, float hum, int pm25) {
    // Không gửi nếu đang rớt mạng
    if (!client.connected()) {
        Serial.println("MQTT ngat ket noi, khong the gui du lieu!");
        return;
    }

    // Khởi tạo Document JSON (Cú pháp của ArduinoJson phiên bản 7)
    JsonDocument doc; 

    // Gắn dữ liệu vào các key (Giống hệt tạo Object trong JS)
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["pm25"] = pm25;

    // Chuyển đối tượng JSON thành chuỗi ký tự (Stringify)
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);

    // Gửi chuỗi dữ liệu lên topic "smarthome/sensors/air"
    Serial.print("Gui du lieu len HiveMQ: ");
    Serial.println(jsonBuffer);
    
    // Publish dữ liệu
    client.publish("smarthome/sensors/air", jsonBuffer);
}