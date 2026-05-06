#include <Arduino.h>;
#include "airSensor.h";
#include "mqttClient.h";

AirSensor mySensor((uint8_t)15, (uint8_t)16, Serial1);
MqttClient myNetwork("P 201", "", "broker.hivemq.com");

unsigned long lastTime = 0;

void setup() {
  Serial.begin(115200);
  mySensor.begin();      // Kích hoạt cảm biến
  myNetwork.connect();   // Kết nối mạng
}

void loop() {
  myNetwork.keepAlive(); 

  if (millis() - lastTime > 5000) {
    SensorData data = mySensor.readAll();
    
    // Truyền tham số cho Object Network để đóng gói JSON và gửi đi
    myNetwork.publishData(data.temperature, data.humidity, data.pm25);
    
    lastTime = millis();
  }
}