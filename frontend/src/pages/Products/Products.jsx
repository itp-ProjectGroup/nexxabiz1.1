import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/features/cart/cartSlice";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added to cart");
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group">
        <Link to={`/product/${product._id}`}>
          <div className="aspect-square overflow-hidden bg-gray-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
        
        <div className="absolute top-3 right-3 z-10">
          <HeartIcon product={product} />
        </div>

        {/* Quick actions overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button 
              onClick={() => addToCartHandler(product, 1)}
              className="bg-white text-gray-900 font-medium py-2 px-5 rounded-full hover:bg-purple-600 hover:text-white transition-colors duration-300 flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <Link 
          to={`/product/${product._id}`}
          className="block mb-1 hover:text-purple-600 transition-colors"
        >
          <h3 className="font-medium text-gray-900 text-lg hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {"★".repeat(Math.floor(product.rating || 0))}
            {"☆".repeat(5 - Math.floor(product.rating || 0))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.numReviews} {product.numReviews === 1 ? "review" : "reviews"})
          </span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-purple-600 font-bold text-lg">${product.price.toFixed(2)}</span>
          
          {product.countInStock > 0 ? (
            <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-xs bg-red-100 text-red-800 py-1 px-2 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;