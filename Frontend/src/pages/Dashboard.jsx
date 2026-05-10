import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { getPM25Color, getCO2Color } from '../utils/aqiHelper';
import StatCard from '../components/StatCard';
import { getLatestData, getChartData} from '../services/api';

const SmartHomeDashboard = () => {
  // State lưu trữ dữ liệu 
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    humidity: 0,
    pm25: 0,
    co2: 0,
  });
  const [chartData, setChartData] = useState([]);

  const initChart = async () => {
    try {
      const data = await getChartData();
      setChartData(data);
    } catch (error) {
      console.error('Error initializing chart in Dashboard:', error);
    }
  };

  const updateChartData = async () => {
    try {
      const response = await getLatestData();
      const newData = response.data;

      setCurrentData(newData);

      setChartData(prevData => {
        const updatedChart = [...prevData, {
          time: new Date().toLocaleTimeString(),
          temp: newData.temperature,
          humidity: newData.humidity,
          pm25: newData.pm25,
          co2: newData.co2
        }];
        
        if(updatedChart.length > 20){
          updatedChart.shift(); // Giữ lại 20 điểm dữ liệu gần nhất
        }
        return updatedChart;
        
      });
    } catch (error) {
      console.error('Error updating chart data in Dashboard:', error);
    }
  };

  useEffect(() => {
    initChart();
    const interval = setInterval(updateChartData, 5000);
    return () => clearInterval(interval);
  }, [])

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
        <StatCard 
          title="Carbon dioxide (MQ135)" 
          value={currentData.co2} 
          unit="ppm" 
          icon={Thermometer} 
          colorClass="bg-green-400 text-green-400" 
        />
      </div>

      {/* Khu vực 2: Biểu đồ giám sát thời gian thực */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 select-none">Biến động chất lượng không khí</h2>
        <div className="h-90 w-full select-none highlight-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
              <Line yAxisId="right" type="monotone" dataKey="co2" name="CO2 (ppm)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SmartHomeDashboard;