import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import jsPDF from "jspdf";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  useEffect(() => {
    if (showSuccess) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [showSuccess]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      setOrderDetails({
        productName: cart.cartItems[0]?.name,
        productPrice: cart.cartItems[0]?.price,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      });
      setShowSuccess(true);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDownloadReceipt = () => {
    if (!orderDetails) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Receipt", 14, 20);
    doc.setFontSize(12);
    doc.text(`Product Name: ${orderDetails.productName || "-"}`, 14, 40);
    doc.text(`Product Price: $${orderDetails.productPrice || 0}`, 14, 50);
    doc.text(`Shipping Price: $${orderDetails.shippingPrice || 0}`, 14, 60);
    doc.text(`Tax Price: $${orderDetails.taxPrice || 0}`, 14, 70);
    doc.text(`Total Price: $${orderDetails.totalPrice || 0}`, 14, 80);
    doc.save("order-receipt.pdf");
    
    // Visual feedback after download
    const downloadBtn = document.getElementById("download-btn");
    if (downloadBtn) {
      const originalText = downloadBtn.innerText;
      downloadBtn.innerText = "Downloaded!";
      downloadBtn.classList.remove("bg-purple-600", "hover:bg-purple-700");
      downloadBtn.classList.add("bg-green-600", "hover:bg-green-700");
      
      setTimeout(() => {
        downloadBtn.innerText = originalText;
        downloadBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        downloadBtn.classList.add("bg-purple-600", "hover:bg-purple-700");
      }, 2000);
    }
  };

  const closeModal = () => {
    setFadeIn(false);
    setTimeout(() => {
      setShowSuccess(false);
    }, 300); // Wait for fade out animation
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left align-top">Image</td>
                  <td className="px-1 py-2 text-left">Product</td>
                  <td className="px-1 py-2 text-left">Quantity</td>
                  <td className="px-1 py-2 text-left">Price</td>
                  <td className="px-1 py-2 text-left">Total</td>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="p-2">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.price.toFixed(2)}</td>
                    <td className="p-2">
                      $ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex justify-between flex-wrap p-8 bg-gray-100 rounded-lg shadow-sm">
            <ul className="text-lg">
              <li>
                <span className="font-semibold mb-4">Items:</span> $
                {cart.itemsPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Shipping:</span> $
                {cart.shippingPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Tax:</span> $
                {cart.taxPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Total:</span> $
                {cart.totalPrice}
              </li>
            </ul>
            {error && <Message variant="danger">{error.data.message}</Message>}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <div><strong>Method:</strong> <p>Cash On delivery</p></div>
            </div>
          </div>
          <button
            type="button"
            className="bg-[#bd7df0] text-white py-2 px-4 rounded-full text-lg w-full mt-4 hover:bg-[#a86de0] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>
          {isLoading && <Loader />}
        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
             onClick={closeModal}
             style={{ 
               opacity: fadeIn ? 1 : 0,
               transition: "opacity 0.3s ease-in-out"
             }}>
          
          {/* Modal Content */}
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              transform: fadeIn ? "scale(1)" : "scale(0.9)",
              transition: "transform 0.3s ease-in-out"
            }}
          >
            {/* Top decoration bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-purple-400 to-pink-500"></div>
            
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Success icon */}
            <div className="flex justify-center mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">Thank you for your purchase. Your order is being processed.</p>
              
              <button
                id="download-btn"
                onClick={handleDownloadReceipt}
                className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Receipt
              </button>
              
              <button
                onClick={() => {
                  closeModal();
                  navigate('/');
                }}
                className="mt-4 text-purple-600 hover:text-purple-800 underline transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceOrder;