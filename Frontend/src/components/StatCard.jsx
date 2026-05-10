import React from 'react';

// Export trực tiếp component để các file khác có thể import
const StatCard = ({ title, value, unit, icon: Icon, colorClass }) => {
  // Logic xử lý màu sắc icon từ bg- sang text-
  const iconColor = colorClass.replace('bg-', 'text-');

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-20`}>
        <Icon className={iconColor} size={32} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">
          {value} <span className="text-lg font-normal text-gray-400">{unit}</span>
        </h3>
      </div>
    </div>
  );
};

export default StatCard;