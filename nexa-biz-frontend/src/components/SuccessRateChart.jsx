import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SuccessRateChart = ({ orders }) => {
    // Calculate success rate (completed orders / total orders)
    const calculateSuccessRate = () => {
        const totalOrders = orders.length;
        const completedOrders = orders.filter(order => order.od_status === 'Completed').length;
        return totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    };

    // Get last 6 months data
    const getLastSixMonths = () => {
        const months = [];
        const successRates = [];
        const today = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            months.push(monthName);

            const monthOrders = orders.filter(order => {
                const orderDate = new Date(order.od_date);
                return orderDate.getMonth() === date.getMonth() && 
                       orderDate.getFullYear() === date.getFullYear();
            });

            const monthCompleted = monthOrders.filter(order => order.od_status === 'Completed').length;
            const successRate = monthOrders.length > 0 ? (monthCompleted / monthOrders.length) * 100 : 0;
            successRates.push(successRate);
        }

        return { months, successRates };
    };

    const { months, successRates } = getLastSixMonths();
    const currentSuccessRate = calculateSuccessRate();

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Success Rate',
                data: successRates,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Success Rate: ${context.parsed.y.toFixed(1)}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9CA3AF'
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(75, 85, 99, 0.1)'
                },
                ticks: {
                    color: '#9CA3AF',
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Success Rate</h3>
                    <p className="text-2xl font-bold text-blue-500 mt-1">{currentSuccessRate.toFixed(1)}%</p>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default SuccessRateChart; 