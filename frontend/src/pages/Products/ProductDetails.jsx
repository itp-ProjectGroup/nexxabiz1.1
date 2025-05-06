import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Header2 from "../../components/Header2";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header2 />
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-20">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-white bg-purple-600 hover:bg-gray-800 px-4 py-2 rounded-lg mb-6 transition-all"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="relative">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-96 rounded-md"
                />
                <div className="absolute top-6 right-6">
                  <HeartIcon product={product} />
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="flex flex-col">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-black">
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>
                
                <div className="text-4xl font-bold text-purple-400 mb-6">
                  ${product.price}
                </div>
                
                <p className="text-gray-900 mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <FaStore className="text-purple-400 mr-2" /> 
                    <span className="font-medium">Brand:</span>
                    <span className="ml-2">{product.brand}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaBox className="text-purple-400 mr-2" /> 
                    <span className="font-medium">In Stock:</span>
                    <span className="ml-2">{product.countInStock}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaClock className="text-purple-400 mr-2" /> 
                    <span className="font-medium">Added:</span>
                    <span className="ml-2">{moment(product.createdAt).fromNow()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaStar className="text-purple-400 mr-2" /> 
                    <span className="font-medium">Reviews:</span>
                    <span className="ml-2">{product.numReviews}</span>
                  </div>
                </div>

                {/* Quantity Select and Add to Cart */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {product.countInStock > 0 && (
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm font-medium mb-1 text-black">Quantity:</label>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="p-2 w-full sm:w-32 rounded-lg bg-white text-black border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      >
                        {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium w-full sm:w-auto ${
                      product.countInStock === 0
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 transition-colors"
                    }`}
                  >
                    <FaShoppingCart className="mr-2" />
                    {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>

              {/* Reviews Section
              <div className="bg-white p-6 rounded-lg shadow-md">
                <ProductTabs
                  loadingProductReview={loadingProductReview}
                  userInfo={userInfo}
                  submitHandler={submitHandler}
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  product={product}
                />
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;