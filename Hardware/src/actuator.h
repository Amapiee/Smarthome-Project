#ifndef ALERTSYSTEM_H
#define ALERTSYSTEM_H

#include <Arduino.h>
#include "airSensor.h" 

class AlertSystem {
private:
    uint8_t buzzerPin;
    uint8_t relayPin;
    
    // Các biến dùng cho thuật toán Non-blocking nháy đèn/còi
    unsigned long previousMillis;
    bool toggleState;
    bool manualFanOverride;

public:
    // Constructor khởi tạo chân cắm
    AlertSystem(uint8_t buzz, uint8_t relay);
    
    void begin();
    
    // Điều khiển quạt thủ công
    void controlFan(bool isOn);
    void setAutoFan();
    
    // Hàm cập nhật trạng thái (gọi liên tục trong loop)
    void update(DangerLevel level);
};

#endif