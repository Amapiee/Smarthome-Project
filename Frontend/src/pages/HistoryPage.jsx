import React, { useState, useEffect } from 'react';
import { getSensorHistory } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getSensorHistory(50);
            setHistory(data);
            setLoading(false);
        };
        fetchHistory();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="flex items-center text-blue-600 hover:underline font-bold">
                    <ArrowLeft size={20} className="mr-2 text-blue-600" /> Dashboard
                </Link>
                <h1 className="text-2xl font-bold flex items-center">
                    <Calendar className="mr-2" /> Sensor Data History
                </h1>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm hover:cursor-pointer hover:bg-green-700 transition-colors select-none tap-highlight-transparent">
                    <Download size={16} className="mr-2" /> Export CSV
                </button>
            </div>

            {/* Biểu đồ diễn biến */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100 select-none tap-highlight-transparent">
                <h2 className="text-lg font-semibold mb-4 select-none">PM2.5 charts & Temperature</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="pm25" stroke="#ef4444" name="PM2.5" />
                            <Line type="monotone" dataKey="temperature" stroke="#3b82f6" name="Temperature" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bảng dữ liệu chi tiết */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 border-b">Time</th>
                            <th className="p-4 border-b">PM2.5 (µg/m³)</th>
                            <th className="p-4 border-b">Temperature (°C)</th>
                            <th className="p-4 border-b">Humidity (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="p-10 text-center">Loading data...</td></tr>
                        ) : (
                            history.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50 border-b">
                                    <td className="p-4">{new Date(record.createdAt).toLocaleString()}</td>
                                    <td className="p-4 font-semibold text-red-600">{record.pm25}</td>
                                    <td className="p-4">{record.temperature}</td>
                                    <td className="p-4">{record.humidity}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryPage;