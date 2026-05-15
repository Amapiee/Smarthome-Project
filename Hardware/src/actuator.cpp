#include "actuator.h"

// Khởi tạo Class, mặc định khai báo 1 bóng LED WS2812B
AlertSystem::AlertSystem(uint8_t buzz, uint8_t relay, uint8_t led) 
  : buzzerPin(buzz), relayPin(relay), ledPin(led),
    pixels(1, led, NEO_GRB + NEO_KHZ800), // Thông số chuẩn của WS2812B
    previousMillis(0), toggleState(false), manualFanOverride(false) {
}

void AlertSystem::begin() {
    pinMode(buzzerPin, OUTPUT);
    pinMode(relayPin, OUTPUT);
    
    // Trạng thái ban đầu: Tắt còi, Tắt quạt
    digitalWrite(buzzerPin, LOW); 
    digitalWrite(relayPin, HIGH); // Mạch Relay thường là Active-LOW (HIGH = Tắt)

    pixels.begin();
    pixels.clear(); 
    pixels.show();
}

void AlertSystem::controlFan(bool isOn) {
    manualFanOverride = true;
    if (isOn) {
        digitalWrite(relayPin, LOW); // Bật quạt
    } else {
        digitalWrite(relayPin, HIGH); // Tắt quạt
    }
}

void AlertSystem::setAutoFan() {
    manualFanOverride = false;
}

void AlertSystem::update(DangerLevel level) {
    unsigned long currentMillis = millis();

    switch (level) {
        case SAFE:
            if (!manualFanOverride) digitalWrite(relayPin, HIGH); // Tắt quạt
            digitalWrite(buzzerPin, LOW); // Tắt còi
            pixels.setPixelColor(0, pixels.Color(0, 255, 0)); // Đèn Xanh lá
            pixels.show();
            break;

        case MODERATE:
            if (!manualFanOverride) digitalWrite(relayPin, HIGH); // Tắt quạt
            digitalWrite(buzzerPin, LOW); 
            pixels.setPixelColor(0, pixels.Color(255, 255, 0)); // Đèn Vàng
            pixels.show();
            break;

        case DANGEROUS:
            if (!manualFanOverride) digitalWrite(relayPin, LOW); // BẬT QUẠT hút mùi!
            digitalWrite(buzzerPin, LOW); 
            pixels.setPixelColor(0, pixels.Color(255, 128, 0)); // Đèn Cam
            pixels.show();
            break;

        case EXTREME:
            if (!manualFanOverride) digitalWrite(relayPin, LOW); 
            
            if (currentMillis - previousMillis >= 300) {
                previousMillis = currentMillis;
                toggleState = !toggleState; // Đảo trạng thái (True/False)
                
                if (toggleState) {
                    digitalWrite(buzzerPin, HIGH); // Còi kêu
                    pixels.setPixelColor(0, pixels.Color(255, 0, 0)); // Đèn Đỏ chót
                } else {
                    digitalWrite(buzzerPin, LOW); // Còi nín
                    pixels.setPixelColor(0, pixels.Color(0, 0, 0)); // Tắt đèn
                }
                pixels.show(); // Cập nhật tín hiệu ra bóng LED
            }
            break;
    }
}