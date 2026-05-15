import React from 'react';

// Export trực tiếp component để các file khác có thể import
const StatCard = ({ title, value, unit, icon: Icon, dangerConfig }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-5 border transition-colors duration-700 ${dangerConfig.border}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`p-2 rounded-lg ${dangerConfig.badge}`}>
          <Icon size={18} className={dangerConfig.text} />
        </div>
      </div>
      <p className={`text-3xl font-bold ${dangerConfig.text}`}>
        {value}
        <span className="text-base font-normal text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
};

export default StatCard;