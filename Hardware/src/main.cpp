#include <Arduino.h>
#include "airSensor.h"
#include "mqttClient.h"
#include "actuator.h"


AirSensor mySensor((uint8_t)15, (uint8_t)16, (uint8_t)17, (uint8_t)18, (uint8_t)19);
MqttClient myNetwork("P_201", "66668888", "broker.hivemq.com");
AlertSystem myActuator((uint8_t)21, (uint8_t)22, (uint8_t)23);

unsigned long lastTime = 0;

// Hàm xử lý tín hiệu MQTT nhận được
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Co tin nhan moi tu topic: ");
  Serial.println(topic);

  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Noi dung tin nhan: ");
  Serial.println(message);

  if (String(topic) == "smarthome/devices/fan") {
    if (message == "ON") {
      Serial.println(">>> LENH BAT QUAT <<<");
      myActuator.controlFan(true);
    } else if (message == "OFF") {
      Serial.println(">>> LENH TAT QUAT <<<");
      myActuator.controlFan(false);
    } else if (message == "AUTO") {
      Serial.println(">>> LENH QUAT TU DONG <<<");
      myActuator.setAutoFan();
    }
  }
}

void setup() {
  Serial.begin(115200);
  mySensor.begin();      // Kích hoạt cảm biến
  
  myNetwork.setCallback(mqttCallback); // Đăng ký hàm callback xử lý lệnh quạt
  
  myNetwork.connect();   // Kết nối mạng
  myActuator.begin();    // Kích hoạt hệ thống cảnh báo
}

void loop() {
  myNetwork.keepAlive(); 
  myActuator.update(mySensor.readAll().dangerLevel); 

  if (millis() - lastTime > 5000) {
    SensorData data = mySensor.readAll();
    
    // Truyền tham số cho Object Network để đóng gói JSON và gửi đi
    myNetwork.publishData(data.temperature, data.humidity, data.pm25, data.co2, data.dangerLevel);
    
    lastTime = millis();
  }
}