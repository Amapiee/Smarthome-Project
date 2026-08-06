#include "actuator.h"

// Khởi tạo Class, mặc định khai báo 1 bóng LED WS2812B
AlertSystem::AlertSystem(uint8_t buzz, uint8_t relay) 
  : buzzerPin(buzz), relayPin(relay),
    previousMillis(0), toggleState(false), manualFanOverride(false) {
}

void AlertSystem::begin() {
    pinMode(buzzerPin, OUTPUT);
    pinMode(relayPin, OUTPUT);
    
    // Trạng thái ban đầu: Tắt còi, Tắt quạt
    digitalWrite(buzzerPin, LOW); 
    digitalWrite(relayPin, LOW); // Mạch Relay là Active-HIGH (LOW = Tắt)
}

void AlertSystem::controlFan(bool isOn) {
    manualFanOverride = true; // Kích hoạt trạng thái đè thủ công (Manual State Lock)
    
    if (isOn) {
        digitalWrite(relayPin, HIGH); // HIGH -> Kích hoạt cuộn hút -> Bật quạt
        Serial.println("-> [Thiết bị] Bật quạt thủ công thành công");
    } else {
        digitalWrite(relayPin, LOW);  // LOW (0V) -> Ngắt cuộn hút -> Tắt quạt
        Serial.println("-> [Thiết bị] Tắt quạt thủ công thành công");
    }
}

void AlertSystem::update(DangerLevel level) {
    unsigned long currentMillis = millis();

    switch (level) {
        case SAFE:
            if (!manualFanOverride) digitalWrite(relayPin, LOW); // Tắt quạt
            digitalWrite(buzzerPin, LOW); // Tắt còi
            break;

        case MODERATE:
            if (!manualFanOverride) digitalWrite(relayPin, LOW); // Tắt quạt
            digitalWrite(buzzerPin, LOW); 
            break;

        case DANGEROUS:
            if (!manualFanOverride) digitalWrite(relayPin, HIGH); // BẬT QUẠT hút mùi!
            digitalWrite(buzzerPin, HIGH); 
            break;

        case EXTREME:
            if (!manualFanOverride) digitalWrite(relayPin, HIGH); 
            
            if (currentMillis - previousMillis >= 500) {
                previousMillis = currentMillis;
                toggleState = !toggleState; // Đảo trạng thái (True/False)
                
                if (toggleState) {
                    digitalWrite(buzzerPin, HIGH); // Còi kêu
                } else {
                    digitalWrite(buzzerPin, LOW); // Còi nín
                }
            }
            break;

        }
    }
    
void AlertSystem::setAutoFan() {
    manualFanOverride = false;
    Serial.println("Chuyen sang che do Quat Tu Dong");
}