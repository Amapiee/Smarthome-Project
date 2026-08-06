import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Biohazard, Thermometer, Droplets, Wind, AlertTriangle, CheckCircle, Book } from 'lucide-react';
import { getDangerLevelConfig } from '../utils/aqiHelper';
import StatCard from '../components/StatCard';
import { getLatestData, getChartData, getDangerLevel } from '../services/api';
import { Link } from 'react-router-dom';

const SmartHomeDashboard = () => {
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    humidity: 0,
    pm25: 0,
    co2: 0,
    dangerLevel: "SAFE",       
  });
  const [chartData, setChartData] = useState([]);

  const initChart = async () => {
    try {
      const data = await getChartData(20);
      console.log("Initial chart data fetched in Dashboard:", data.data);

      const formattedData = data.data.map(element => ({
        time:       new Date(element.timestamp).toLocaleTimeString(),
        temperature:     element.temperature,
        humidity:   element.humidity,
        pm25:       element.pm25,
        co2:       element.co2,
      }));
      setChartData(formattedData);

      setCurrentData(prev => ({ ...prev, ...data.data[0] }));
    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  };
  
  const updateChartData = async () => {
    try {
      const response = await getLatestData();
      const newData = response.data;
      // console.log("Latest sensor data fetched in Dashboard:", newData);

      setCurrentData(prev => ({ ...prev, ...newData }));   
      
      setChartData(prev => {
        const updated = [...prev, {
          time:       new Date().toLocaleTimeString(),
          temperature:     newData.temperature,
          humidity:   newData.humidity,
          pm25:       newData.pm25,
          co2:       newData.co2,
        }];
        console.log()
        if (updated.length > 20) updated.shift();
        return updated;
      });
    } catch (error) {
      console.error('Error updating chart data in Dashboard:', error);
    }
  };

  const fetchDangerLevel = async () => {
    try {
      const dangerLevelData = await getDangerLevel();
      setCurrentData(prev => ({ ...prev, dangerLevel: dangerLevelData.data.dangerLevel }));
    } catch (error) {
      console.error('Error fetching danger level in Dashboard:', error);
    }
  };
  
  useEffect(() => {
    initChart();
    fetchDangerLevel();

    const interval = setInterval( () => {
      updateChartData();
      fetchDangerLevel();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const danger = useMemo(() => {
  return getDangerLevelConfig(currentData.dangerLevel);
}, [currentData.dangerLevel]);

  return (
    // ✅ Nền toàn trang đổi màu theo danger level
    <div className={`p-8 min-h-screen font-sans transition-colors duration-700 ${danger.bg}`}>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Smart Home Dashboard</h1>

        <div className="flex items-center gap-4">
          {/* ✅ Badge mức nguy hiểm */}
          <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${danger.badge} ${danger.border}`}>
            {currentData.dangerLevel === "SAFE"
              ? <CheckCircle size={16} />
              : <AlertTriangle size={16} />
            }
            {danger.label}
          </span>
          
          <Link 
            to="/fan-control" 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Wind size={20} />
            Điều khiển
          </Link>

          <Link 
            to="/history" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Book className="mr-2" />
            Lịch sử 
          </Link>
        </div>
      </div>

      {/* ✅ Banner cảnh báo — chỉ hiện khi DANGEROUS hoặc EXTREME */}
      {(currentData.dangerLevel === "DANGEROUS" || currentData.dangerLevel === "EXTREME") && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 animate-pulse ${danger.bg} ${danger.border}`}>
          <AlertTriangle className={danger.text} size={24} />
          <div>
            <p className={`font-bold ${danger.text}`}>
              {currentData.dangerLevel === "EXTREME"
                ? "🚨 Mức độ CỰC KỲ NGUY HIỂM — Hãy rời khỏi khu vực ngay!"
                : "⚠️ Chất lượng không khí NGUY HIỂM — Hạn chế ra ngoài!"}
            </p>
            <p className="text-sm text-gray-500">
              PM2.5: {currentData.pm25} µg/m³ · co2: {currentData.co2} ppm
            </p>
          </div>
        </div>
      )}

      {/* ── Stat Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Nhiệt độ"
          value={currentData.temperature}
          unit="°C"
          icon={Thermometer}
          dangerConfig={danger}         // ✅ Truyền config thay vì hardcode màu
        />
        <StatCard
          title="Độ ẩm"
          value={currentData.humidity}
          unit="%"
          icon={Droplets}
          dangerConfig={danger}
        />
        <StatCard
          title="Bụi mịn PM2.5"
          value={currentData.pm25}
          unit="µg/m³"
          icon={Wind}
          dangerConfig={danger}
        />
        <StatCard
          title="TVOC"
          value={currentData.co2}
          unit="ppm"
          icon={Biohazard}
          dangerConfig={danger}
        />
      </div>

      {/* ── Biểu đồ ───────────────────────────────────────────── */}
      {/* ── Biểu đồ 1: Chất lượng không khí (PM2.5 & co2) ──────────────────────── */}
<div className={`bg-white rounded-xl shadow-md p-6 border transition-colors duration-700 ${danger.border} mb-6`}>
  <h2 className="text-xl font-bold text-gray-800 mb-4 select-none">
    Biến động Chất lượng không khí
  </h2>
  <div className="h-80 w-full select-none">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" stroke="#6b7280" />
        
        {/* Trục Y trái cho PM2.5, Trục Y phải cho co2 */}
        <YAxis
        yAxisId="left"
        stroke="#6b7280"
        />
        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
        
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        />
        <Legend />
        
        <Line yAxisId="left" type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke={danger.dot || "#f59e0b"} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        {/* Đảm bảo trong biến chartData của bạn có trường "co2" */}
        <Line yAxisId="right" type="monotone" dataKey="co2" name="TVOC (ppm)" stroke="#edb228" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

{/* ── Biểu đồ 2: Môi trường (Nhiệt độ & Độ ẩm) ───────────────────────────── */}
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-colors duration-700">
  <h2 className="text-xl font-bold text-gray-800 mb-4 select-none">
    Biến động Nhiệt độ & Độ ẩm
  </h2>
  <div className="h-80 w-full select-none">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" stroke="#6b7280" />
        
        {/* Trục Y trái cho Nhiệt độ, Trục Y phải cho Độ ẩm */}
        <YAxis 
        yAxisId="left" 
        stroke="#6b7280"
        domain={['dataMin - 10', 'dataMax + 10']} 
        ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}/>
        <YAxis 
        yAxisId="right"
        orientation="right" 
        stroke="#6b7280" 
        domain={[0, 100]}
        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        />
        
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        />
        <Legend />
        
        <Line yAxisId="left" type="monotone" dataKey="temperature" name="Nhiệt độ (°C)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line yAxisId="right" type="monotone" dataKey="humidity" name="Độ ẩm (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
};

export default SmartHomeDashboard;