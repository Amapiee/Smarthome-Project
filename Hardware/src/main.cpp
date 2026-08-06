#include <Arduino.h>
#include <DHT.h>
#include "display.h"
#include "airSensor.h"
#include "mqttClient.h"
#include "actuator.h"

// Chan LCD 21 22

AirSensor mySensor((uint8_t)4, DHT22, (uint8_t)36, (uint8_t)19, (uint8_t)39);
MqttClient myNetwork("tnh", "88889999", "f9908a08b3af44cda6e8d85b7c4fe042.s1.eu.hivemq.cloud");
AlertSystem myActuator((uint8_t)27, (uint8_t)5);
DisplayManager myDisplay;

unsigned long lastTime = 0;

// Hàm xử lý tín hiệu MQTT nhận được
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  // Chuyển đổi payload thành String
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  // Loại bỏ các ký tự xuống dòng hoặc khoảng trắng thừa nếu có
  message.trim(); 

  Serial.print("Co tin nhan moi tu topic: ");
  Serial.println(topic);
  Serial.print("Noi dung tin nhan: ");
  Serial.println(message);

  if (String(topic) == "smarthome/device/fan") {
    if (message == "ON") {
      Serial.println(">>> LENH BAT QUAT <<<");
      myActuator.controlFan(true);
    } else if (message == "OFF") {
      Serial.println(">>> LENH TAT QUAT <<<");
      myActuator.controlFan(false);
    } else if (message == "AUTO") {
      Serial.println(">>> LENH QUAT TU DONG <<<");
      myActuator.setAutoFan();
    } else {
      Serial.println("[MQTT Error] Lenh khong hop le!");
    }
  }
}

void setup() {
  Serial.begin(115200);
  mySensor.begin();      // Kích hoạt cảm biến
  myDisplay.begin();
  myNetwork.setCallback(mqttCallback); // Đăng ký hàm callback xử lý lệnh quạt
  
  myNetwork.connect();   // Kết nối mạng
  myActuator.begin();    // Kích hoạt hệ thống cảnh báo
}

void loop() {
  // 1. Luôn duy trì kết nối mạng và lắng nghe luồng điều khiển ở tốc độ cao nhất
  myNetwork.keepAlive(); 

  unsigned long currentMillis = millis();
  SensorData data;

  if (currentMillis - lastTime >= 2000){
    lastTime = currentMillis;

    data = mySensor.readAll();
    
    myNetwork.publishData(data.temperature, data.humidity, data.pm25, data.co2, data.dangerLevel);
    
    myDisplay.updateScreen(data); 
  }
    
  myActuator.update(data.dangerLevel); 
}