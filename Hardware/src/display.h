#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include <LiquidCrystal_I2C.h>
#include "airSensor.h" 

class DisplayManager {
private:
    LiquidCrystal_I2C lcd;
    unsigned long lastUpdate;

public:
    // Khởi tạo ngay trong Constructor với địa chỉ 0x27, 16 cột, 2 hàng
    DisplayManager() : lcd(0x27, 16, 2), lastUpdate(0) {}

    void begin() {
        lcd.init();
        lcd.backlight();
        lcd.setCursor(0, 0);
        lcd.print("System Starting");
    }

    // Hàm nhận thẳng Struct dữ liệu để in ra màn hình
    void updateScreen(SensorData data) {
    lcd.clear(); 

    // Dòng 1: Thông tin môi trường
    lcd.setCursor(0, 0);
    lcd.print("T:"); 
    lcd.print(data.temperature, 1); // Hiển thị 1 chữ số thập phân
    lcd.print((char)223); // Ký tự độ
    lcd.print("C ");
    
    lcd.print("H:");
    lcd.print((int)data.humidity);
    lcd.print("%");

    // Dòng 2: Chỉ số an toàn (Cảnh báo)
    lcd.setCursor(0, 1);
    if (!data.isValid) {
        lcd.print("ERR: CHECK SENSOR");
    } else {
        lcd.print("PM2.5:");
        lcd.print((int)data.pm25);
        lcd.print("ug/m3");
    }
}
};

#endif