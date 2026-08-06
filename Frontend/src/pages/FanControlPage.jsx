import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wind, Fan, Power, ArrowLeft, Bot } from 'lucide-react';
import { setFanState, setFanSpeedAPI, setAutoFanAPI } from '../services/devicesApi';

const FanControlPage = () => {
  const [isFanOn, setIsFanOn] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(1);

  const toggleFan = () => {
    setIsFanOn(!isFanOn);
    setFanState(!isFanOn);
    setIsAutoMode(false); 
  };

  const handleSpeedChange = (speed) => {
    setFanSpeed(speed);
    setFanSpeedAPI(speed);
  };

  const handleAutoFan = () => {
    setAutoFanAPI();
    setIsAutoMode(true);
    setIsFanOn(false); 
  };

return (
    <div className="p-8 min-h-screen font-sans bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="select-none flex items-center mb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl text-blue-600 hover:text-blue-800 hover:underline font-semibold hover:cursor-pointer transition-colors mr-auto"
          >
            <ArrowLeft size={20} />
            Quay lại Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 select-none">
            <Wind size={32} className="text-green-600" />
            Điều khiển
          </h1>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          
          {/* Cảnh báo chế độ Auto */}
          {isAutoMode && (
            <div className="mb-4 inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold animate-pulse">
              ĐANG Ở CHẾ ĐỘ TỰ ĐỘNG (DỰA THEO CẢM BIẾN)
            </div>
          )}

          <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-colors duration-500 ${isFanOn ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Fan size={64} className={`transition-all duration-1000 ${isFanOn ? 'text-green-600 animate-spin' : 'text-gray-400'}`} style={{ animationDuration: `${isAutoMode ? 1.5 : 3 / fanSpeed}s` }} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Trạng thái: {isAutoMode ? 'AUTO' : (isFanOn ? 'ĐANG BẬT' : 'ĐÃ TẮT')}
          </h2>
          
          {/* Cụm nút điều khiển */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={toggleFan}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                !isAutoMode && isFanOn ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              } ${isAutoMode ? 'opacity-50' : 'opacity-100'}`}
            >
              <Power size={24} />
              {!isAutoMode && isFanOn ? 'TẮT QUẠT' : 'BẬT QUẠT'}
            </button>

            {/* Nút AUTO */}
            <button
              onClick={handleAutoFan}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                isAutoMode ? 'bg-purple-600 text-white ring-4 ring-purple-200' : 'bg-gray-200 hover:bg-purple-100 text-gray-700 hover:text-purple-700'
              }`}
            >
              <Bot size={24} />
              AUTO
            </button>
          </div>

          {/* Tốc độ quạt (Chỉ hiện khi đang bật và KHÔNG ở chế độ Auto) */}
          {isFanOn && !isAutoMode && (
            <div className="mt-10 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Cấp độ gió (Thủ công)</h3>
              <div className="flex justify-center gap-4">
                {[1, 2, 3].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`w-14 h-14 rounded-full font-bold text-lg transition-all shadow-sm ${
                      fanSpeed === speed 
                        ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg scale-110' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FanControlPage;