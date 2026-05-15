import React, { useState, useEffect } from 'react';
import { getSensorHistory } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import HistoryTableBody from '../components/HistoryTableBody';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const newData = await getSensorHistory(25);
            setHistory(newData.data || []);
            console.log("after update", history);
        } catch (error) {
            console.error("Failed to fetch data in History Page:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                <div className="flex gap-3">
                    <button 
                        onClick={fetchHistory}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm hover:cursor-pointer hover:bg-blue-700 transition-colors select-none tap-highlight-transparent disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> 
                        Refresh
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm hover:cursor-pointer hover:bg-green-700 transition-colors select-none tap-highlight-transparent">
                        <Download size={16} className="mr-2" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Bảng dữ liệu chi tiết */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 border-b select-none">Time</th>
                            <th className="p-4 border-b select-none">PM2.5 (µg/m³)</th>
                            <th className="p-4 border-b select-none">Temperature (°C)</th>
                            <th className="p-4 border-b select-none">Humidity (%)</th>
                            <th className="p-4 border-b select-none">TVOC (ppm)</th>
                        </tr>
                    </thead>
                    <HistoryTableBody loading={loading} history={history} />
                </table>
            </div>
        </div>
    );
};

export default HistoryPage;