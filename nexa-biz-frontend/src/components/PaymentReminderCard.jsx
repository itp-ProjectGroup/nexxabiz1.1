import { useState, useEffect } from 'react';

const PaymentReminderCard = ({ orders, calculateOrderTotal }) => {
  const [reminderOrders, setReminderOrders] = useState([]);

  useEffect(() => {
    if (!orders || !Array.isArray(orders)) return;

    // Filter orders that are one day before overdue or already overdue
    const currentDate = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);

    const filteredOrders = orders.filter(order => {
      if (!order.overdue_date || order.pay_status !== 'Pending') return false;
      
      const overdueDate = new Date(order.overdue_date);
      
      // Check if order is due tomorrow or already overdue
      const isDueTomorrow = 
        overdueDate.getDate() === tomorrow.getDate() && 
        overdueDate.getMonth() === tomorrow.getMonth() && 
        overdueDate.getFullYear() === tomorrow.getFullYear();
        
      const isOverdue = overdueDate <= currentDate;
      
      return isDueTomorrow || isOverdue;
    });

    setReminderOrders(filteredOrders);
  }, [orders]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if order is overdue
  const isOrderOverdue = (overdueDate) => {
    const currentDate = new Date();
    return new Date(overdueDate) <= currentDate;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold text-white mb-3">Payment Reminders</h3>
      
      {reminderOrders.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400">No payment reminders</p>
        </div>
      ) : (
        <div 
          className="flex-grow overflow-auto" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none' 
          }}
        >
          {/* Apply CSS to hide scrollbar for WebKit browsers */}
          <style dangerouslySetInnerHTML={{ __html: `
            div::-webkit-scrollbar {
              display: none;
            }
          `}} />
          
          <div className="space-y-3 mt-1">
            {reminderOrders.map((order) => (
              <div 
                key={order.od_Id}
                className={`p-3 rounded-lg transition-all ${
                  isOrderOverdue(order.overdue_date) 
                    ? 'bg-red-900/20 border border-red-600/40' 
                    : 'bg-yellow-900/20 border border-yellow-600/40'
                }`}
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="font-medium text-white">Order #{order.od_Id}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isOrderOverdue(order.overdue_date) 
                      ? 'bg-red-500/80 text-white' 
                      : 'bg-yellow-500/80 text-gray-900'
                  }`}>
                    {isOrderOverdue(order.overdue_date) ? 'Overdue' : 'Due Tomorrow'}
                  </span>
                </div>
                <div className="flex justify-between mt-2 flex-wrap gap-1">
                  <span className="text-gray-300 text-sm">
                    {order.company_name}
                  </span>
                  <span className="font-semibold text-white">
                    ${calculateOrderTotal(order).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Due: {formatDate(order.overdue_date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {reminderOrders.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            {reminderOrders.length} {reminderOrders.length === 1 ? 'order' : 'orders'} need attention
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentReminderCard;