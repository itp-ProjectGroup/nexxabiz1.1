const DashboardCard = ({ title, value, icon, chart, status }) => {
    return (
        <div className="bg-gray-700 rounded-xl p-4 shadow-md flex flex-col justify-between h-full min-w-0">
            <div className="flex items-center justify-between mb-2">
                <div className="text-white text-lg font-semibold truncate">{title}</div>
                {icon && <div className="text-2xl flex-shrink-0">{icon}</div>}
            </div>
            
            <div className="text-2xl font-bold text-blue-400 break-words max-w-full truncate">
                {value}
            </div>

            {status && (
                <div className={`mt-2 text-sm rounded px-2 py-1 inline-block ${status === 'Good' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {status}
                </div>
            )}

            {chart && <div className="mt-4">{chart}</div>}
        </div>
    );
};

export default DashboardCard;
