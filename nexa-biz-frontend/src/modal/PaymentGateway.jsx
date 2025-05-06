import { useState, useEffect } from "react";
import { X, CreditCard, Building2, Receipt, Wallet, Check, ArrowRight, ChevronLeft } from "lucide-react";

const PaymentGateway = ({ order, isOpen, onClose, onUpdated, products, payments }) => {
    const [paymentId, setPaymentId] = useState(""); 
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [remark, setRemark] = useState("");
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    
    // Animation states
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        if (order) {
            generatePaymentId();
            calculateRemainingBalance();
            setFadeIn(true);
        }
    }, [order, products, payments]);

    const generatePaymentId = () => {
        let lastPaymentId = localStorage.getItem("lastPaymentId") || "PID00000000";
        let numericPart = parseInt(lastPaymentId.substring(3)) + 1;
        let newPaymentId = `PID${numericPart.toString().padStart(8, "0")}`;
        setPaymentId(newPaymentId);
        localStorage.setItem("lastPaymentId", newPaymentId);
    };

    const calculateOrderTotal = (order) => {
        if (!products || !Array.isArray(order.od_items)) return 0;
    
        return order.od_items.reduce((sum, item) => {
            const product = products.find(p => p.manufacturingID === item.manufacturingID);
            const price = product?.sellingPrice || 0;
            return sum + price * item.qty;
        }, 0);
    };

    const getPaidAmountForOrder = (orderId) => {
        const orderPayments = payments.filter(payment => payment.orderId === orderId);
        const totalPaidAmount = orderPayments.reduce((sum, payment) => sum + payment.paymentAmount, 0);
        return totalPaidAmount;
    };

    const calculateRemainingBalance = () => {
        if (!order) return;
        
        const orderTotal = calculateOrderTotal(order);
        const paidAmount = getPaidAmountForOrder(order.od_Id);
        const remaining = orderTotal - paidAmount;
        
        setRemainingBalance(remaining);
        // Set default payment amount to remaining balance
        setPaymentAmount(remaining.toFixed(2));
    };

    const handlePayment = async () => {
        if (!paymentAmount || !paymentMethod) {
            alert("Please enter payment amount and select a payment method.");
            return;
        }

        // Check if payment amount exceeds remaining balance
        if (parseFloat(paymentAmount) > remainingBalance) {
            alert("Total amount exceeding. Please enter a valid amount.");
            return;
        }

        setIsProcessing(true);

        const paymentData = {
            paymentId,
            orderId: order.od_Id,
            paymentAmount: parseFloat(paymentAmount),
            paymentMethod,
            remark,
        };

        // Calculate if this payment will result in a fully paid order
        const newRemainingBalance = remainingBalance - parseFloat(paymentAmount);
        const willBePaid = newRemainingBalance <= 0.001; // Using small threshold to handle floating point errors

        try {
            // First save the payment
            const paymentResponse = await fetch("http://localhost:5000/api/payments", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });
            
            if (!paymentResponse.ok) {
                throw new Error('Payment request failed');
            }
            
            // Then update the order status if necessary
            if (willBePaid) {
                await updateOrderPaymentStatus(order.od_Id, 'Paid');
            }
            
            setTimeout(() => {
                setIsProcessing(false);
                alert(`Payment Successful! Payment ID: ${paymentId}`);
                onUpdated(); // Refresh data
                onClose();   // Close modal
            }, 1000);
        } catch (error) {
            console.error("Payment Error:", error);
            setIsProcessing(false);
            alert("Payment failed. Please try again.");
        }
    };
    
    const updateOrderPaymentStatus = async (orderId, status) => {
        try {
            // Assuming you have an API endpoint to update order status
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pay_status: status
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // Get payment status color
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'paid': return 'bg-green-500';
            case 'partially paid': return 'bg-yellow-500';
            case 'pending': return 'bg-red-400';
            default: return 'bg-gray-500';
        }
    };

    // Get payment method icon
    const getPaymentMethodIcon = (method) => {
        switch(method) {
            case 'Credit Card': return <CreditCard className="mr-2" size={16} />;
            case 'Bank Transfer': return <Building2 className="mr-2" size={16} />;
            case 'Cheque': return <Receipt className="mr-2" size={16} />;
            case 'Cash': return <Wallet className="mr-2" size={16} />;
            default: return null;
        }
    };

    const handleNextStep = () => {
        if (activeStep === 1) {
            if (!paymentAmount) {
                alert("Please enter payment amount.");
                return;
            }
            if (parseFloat(paymentAmount) > remainingBalance) {
                alert("Total amount exceeding. Please enter a valid amount.");
                return;
            }
        } else if (activeStep === 2) {
            if (!paymentMethod) {
                alert("Please select a payment method.");
                return;
            }
        }
        
        setActiveStep(activeStep + 1);
    };

    const handlePrevStep = () => {
        setActiveStep(activeStep - 1);
    };

    if (!isOpen || !order) return null;

    const orderTotal = calculateOrderTotal(order);
    const paidAmount = getPaidAmountForOrder(order.od_Id);
    const completionPercentage = (paidAmount / orderTotal) * 100;

    return (
        <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div 
                className={`bg-gray-900 rounded-xl p-4 md:p-6 w-full max-w-sm shadow-2xl relative border border-gray-700 transform transition-all duration-300 ${fadeIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Payment Gateway
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Order Info */}
                <div className="mb-4">
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-400">Order ID</span>
                        <span className="font-medium text-white">{order.od_Id}</span>
                    </div>
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-400">Company</span>
                        <span className="font-medium truncate max-w-[65%] text-white">{order.company_name}</span>
                    </div>
                </div>

                {/* Payment Progress */}
                <div className="mb-4">
                    <div className="flex justify-between mb-1 text-xs text-gray-400">
                        <span>Payment Progress</span>
                        <span>{completionPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-gray-800 p-2 rounded-lg">
                            <p className="text-gray-400 text-xs">Order Total</p>
                            <p className="text-base font-bold text-white">${orderTotal.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-800 p-2 rounded-lg">
                            <p className="text-gray-400 text-xs">Amount Paid</p>
                            <p className="text-base font-bold text-white">${paidAmount.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 bg-blue-900 bg-opacity-30 p-2 rounded-lg border border-blue-700">
                        <div>
                            <p className="text-blue-300 text-xs">Remaining Balance</p>
                            <p className="text-base font-bold text-white">${remainingBalance.toFixed(2)}</p>
                        </div>
                        <div className={`${getStatusColor(order.pay_status)} px-2 py-0.5 rounded-full text-white text-xs`}>
                            {order.pay_status || 'Pending'}
                        </div>
                    </div>
                </div>

                {/* Multi-step form */}
                <div className="mt-4">
                    {/* Step indicators */}
                    <div className="flex justify-between mb-4">
                        <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-white' : 'text-gray-500'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}>1</div>
                            <span className="text-xs mt-1">Amount</span>
                        </div>
                        <div className={`h-0.5 flex-1 self-center mx-2 ${activeStep >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                        <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-white' : 'text-gray-500'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}>2</div>
                            <span className="text-xs mt-1">Method</span>
                        </div>
                        <div className={`h-0.5 flex-1 self-center mx-2 ${activeStep >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                        <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-white' : 'text-gray-500'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}>3</div>
                            <span className="text-xs mt-1">Confirm</span>
                        </div>
                    </div>

                    {/* Step 1: Amount */}
                    {activeStep === 1 && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Payment Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                                    <input 
                                        type="number" 
                                        className="w-full p-1.5 pl-7 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 text-sm"
                                        value={paymentAmount} 
                                        onChange={(e) => setPaymentAmount(e.target.value)} 
                                        max={remainingBalance}
                                        step="0.01"
                                    />
                                </div>
                                <div className="text-right mt-1">
                                    <button 
                                        className="text-xs text-blue-400 hover:text-blue-300"
                                        onClick={() => setPaymentAmount(remainingBalance.toFixed(2))}
                                    >
                                        Pay full amount
                                    </button>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button 
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 text-sm"
                                    onClick={handleNextStep}
                                >
                                    Next <ArrowRight size={14} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Method */}
                    {activeStep === 2 && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Payment Method</label>
                                <div className="grid grid-cols-2 gap-2 text-white">
                                    {[
                                        {value: 'Credit Card', icon: <CreditCard size={16} />, label: 'Credit Card'},
                                        {value: 'Bank Transfer', icon: <Building2 size={16} />, label: 'Bank Transfer'},
                                        {value: 'Cheque', icon: <Receipt size={16} />, label: 'Cheque'},
                                        {value: 'Cash', icon: <Wallet size={16} />, label: 'Cash'}
                                    ].map((method) => (
                                        <button
                                            key={method.value}
                                            className={`flex items-center justify-center p-2 rounded-lg border ${paymentMethod === method.value ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 'border-gray-700 bg-gray-800 hover:bg-gray-700'} transition-all duration-200`}
                                            onClick={() => setPaymentMethod(method.value)}
                                        >
                                            <div className="flex flex-col items-center">
                                                {method.icon}
                                                <span className="mt-1 text-xs">{method.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Remark (Optional)</label>
                                <input 
                                    type="text" 
                                    className="w-full p-1.5 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 text-sm"
                                    value={remark} 
                                    onChange={(e) => setRemark(e.target.value)} 
                                    placeholder="Add a note"
                                />
                            </div>
                            
                            <div className="pt-2 grid grid-cols-2 gap-2">
                                <button 
                                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center transition-all duration-200 text-sm"
                                    onClick={handlePrevStep}
                                >
                                    <ChevronLeft size={14} className="mr-1" /> Back
                                </button>
                                <button 
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center transition-all duration-200 text-sm"
                                    onClick={handleNextStep}
                                >
                                    Next <ArrowRight size={14} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {activeStep === 3 && (
                        <div className="space-y-3">
                            <div className="bg-gray-800 rounded-lg p-3">
                                <h3 className="text-sm font-medium mb-2 text-white">Payment Summary</h3>
                                
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Payment ID</span>
                                        <span className="text-xs text-gray-400">{paymentId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Amount</span>
                                        <span className="font-medium text-gray-400">${parseFloat(paymentAmount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Method</span>
                                        <div className="flex items-center text-gray-400">
                                            {getPaymentMethodIcon(paymentMethod)}
                                            <span>{paymentMethod}</span>
                                        </div>
                                    </div>
                                    {remark && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Remark</span>
                                            <span className="text-right max-w-[60%] text-xs truncate">{remark}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="pt-2 grid grid-cols-2 gap-2">
                                <button 
                                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center transition-all duration-200 text-sm"
                                    onClick={handlePrevStep}
                                    disabled={isProcessing}
                                >
                                    <ChevronLeft size={14} className="mr-1" /> Back
                                </button>
                                <button 
                                    className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center transition-all duration-200 text-sm ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={14} className="mr-1" /> Confirm
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;