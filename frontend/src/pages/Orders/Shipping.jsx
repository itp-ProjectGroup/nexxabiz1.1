import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import Header2 from "../../components/Header2";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Redirect if no shipping address is provided
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header2 should be responsive. Ensure it uses Tailwind classes like 
          `w-full`, `flex`, `justify-between`, `items-center`, and responsive 
          padding/margins (e.g., `px-4 sm:px-6 lg:px-8`). For navigation, use 
          `hidden` and `sm:flex` to toggle visibility on mobile, or implement a 
          hamburger menu with `md:hidden`. */}
      <Header2 />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <ProgressSteps step1 step2 />

        {/* Form container with responsive margin-top to account for fixed header */}
        <div className="mt-8 flex justify-center">
          <form
            onSubmit={submitHandler}
            className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
          >
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
              Shipping
            </h1>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Address
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#bd7df0] transition"
                placeholder="Enter address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* City */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                City
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#bd7df0] transition"
                placeholder="Enter city"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* Postal Code */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Postal Code
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#bd7df0] transition"
                placeholder="Enter postal code"
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            {/* Country (Commented out in original, kept as is) */}
            {/* <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Country
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#bd7df0] transition"
                placeholder="Enter country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div> */}

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Select Method
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#bd7df0] focus:ring-[#bd7df0]"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-2 text-gray-700">Cash On Delivery</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-[#bd7df0] text-white py-3 px-4 rounded-lg text-lg font-medium hover:bg-[#a86de0] transition duration-300 shadow-md"
              type="submit"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;