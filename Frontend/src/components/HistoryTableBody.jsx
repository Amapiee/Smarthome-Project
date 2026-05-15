import React from 'react';

const HistoryTableBody = ({ loading, history }) => {
    return (
        <tbody>
            {loading ? (
                <tr>
                    <td colSpan="4" select-none tap-highlight-transparent font-bold className="p-10 text-center text-gray-500">
                        Đang tải dữ liệu...
                    </td>
                </tr>
            ) : (
                history.map((record, index) => (
                    <tr key={record._id || index} className="hover:bg-gray-50 border-b">
                        <td className="p-4 text-gray-700">
                            {new Date(record.timestamp).toLocaleString()}
                        </td>
                        {/* PM2.5 được làm nổi bật nếu vượt ngưỡng an toàn (ví dụ > 150 µg/m³) */}
                        <td className="p-4 font-semibold text-red-600">
                            {record.pm25}
                        </td>
                        <td className="p-4 text-gray-700">{record.temperature}°C</td>
                        <td className="p-4 text-gray-700">{record.humidity}%</td>
                        <td className="p-4 text-gray-700">{record.co2} ppm</td>
                    </tr>
                ))
            )}
        </tbody>
    );
};

export default HistoryTableBody;