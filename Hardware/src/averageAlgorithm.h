#ifndef AVERAGE_ALGORITHM_H
#define AVERAGE_ALGORITHM_H

// 1. CÔNG CỤ TOÁN HỌC THUẦN TÚY (Dùng Template để tránh cấp phát động)
template <uint8_t WINDOW_SIZE>
class MovingAverage {
private:
    float readings[WINDOW_SIZE]; // Cấp phát tĩnh, không dùng 'new'
    uint8_t index; 
    float sum; 
    uint8_t count; 

public:
    MovingAverage() {
        for (uint8_t i = 0; i < WINDOW_SIZE; i++) {
            readings[i] = 0.0f;
        }
        index = 0;
        sum = 0.0f;
        count = 0;
    }

    float filter(float newValue) {
        sum = sum - readings[index]; 
        readings[index] = newValue;
        sum = sum + newValue;
        
        index = (index + 1) % WINDOW_SIZE;
        
        if (count < WINDOW_SIZE) {
            count++;
        }
        return sum / count;
    }
};

// 2. KHỐI XỬ LÝ DỮ LIỆU ĐẶC THÙ (Nên đưa vào file airSensor.cpp)
class DustCompensation {
public:
    static float apply(float rawDust, float currentTemp, float currentHum) {
        float correctedDust = rawDust;

        // Bù trừ độ ẩm (Chỉ tác động khi độ ẩm > 60%)
        if (currentHum > 60.0f) {
            float alpha = 0.85f; 
            correctedDust -= (alpha * (currentHum - 60.0f));
        }

        // Bù trừ nhiệt độ
        float beta = 0.15f; 
        correctedDust += (beta * (currentTemp - 25.0f));

        return (correctedDust < 0.0f) ? 0.0f : correctedDust;
    }
};

#endif