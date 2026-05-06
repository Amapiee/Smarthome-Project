import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Droplets, Wind } from 'lucide-react';

const SmartHomeDashboard = () => {
  // State lưu trữ dữ liệu 
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    humidity: 0,
    pm25: 0
  });

  // State lưu trữ mảng lịch sử để vẽ biểu đồ
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    
    // Tạo data giả lập để test UI
    const mockData = [
      { time: '08:00', temp: 28, humidity: 60, pm25: 15 },
      { time: '09:00', temp: 29, humidity: 58, pm25: 18 },
      { time: '10:00', temp: 31, humidity: 55, pm25: 22 },
      { time: '11:00', temp: 32, humidity: 52, pm25: 35 },
      { time: '12:00', temp: 33, humidity: 50, pm25: 42 },
    ];
    
    setHistoryData(mockData);
    setCurrentData({ temperature: 33, humidity: 50, pm25: 42 }); // Dữ liệu mới nhất
  }, []);

  // Component hiển thị Thẻ chỉ số (Card)
  const StatCard = ({ title, value, unit, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-20`}>
        <Icon className={colorClass.replace('bg-', 'text-')} size={32} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value} {unit}</h3>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Smart Home Dashboard</h1>
      
      {/* Khu vực 1: Các thẻ chỉ số hiện tại */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Nhiệt độ (DHT22)" 
          value={currentData.temperature} 
          unit="°C" 
          icon={Thermometer} 
          colorClass="bg-red-500 text-red-500" 
        />
        <StatCard 
          title="Độ ẩm (DHT22)" 
          value={currentData.humidity} 
          unit="%" 
          icon={Droplets} 
          colorClass="bg-blue-500 text-blue-500" 
        />
        <StatCard 
          title="Bụi mịn PM2.5 (PMS5003)" 
          value={currentData.pm25} 
          unit="µg/m³" 
          icon={Wind} 
          colorClass="bg-gray-700 text-gray-700" 
        />
      </div>

      {/* Khu vực 2: Biểu đồ giám sát thời gian thực */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Biến động chất lượng không khí</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temp" name="Nhiệt độ (°C)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line yAxisId="left" type="monotone" dataKey="humidity" name="Độ ẩm (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#374151" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SmartHomeDashboard;