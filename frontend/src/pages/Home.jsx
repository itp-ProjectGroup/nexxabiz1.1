import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import HomeHeroSection from "../components/HomeHeroSection";
import Header2 from "../components/Header2";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (data && data.products) {
      // Get up to 8 products for featured section
      setFeaturedProducts(data.products.slice(0, 8));
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.products.map(p => p.category || "uncategorized"))];
      setCategories(["all", ...uniqueCategories]);
    }
  }, [data]);

  const filterProductsByCategory = (category) => {
    if (category === "all") {
      return data.products;
    }
    return data.products.filter(product => product.category === category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header2 />
      <HomeHeroSection />
      {!keyword ? <Header /> : null}
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader />
        </div>
      ) : isError ? (
        <div className="container mx-auto px-4 py-8">
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        </div>
      ) : (
        <>
          {/* Featured Products Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                Featured Products
              </h2>
              <div className="relative inline-block group">
                <Link
                  to="/shop"
                  className="bg-purple-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 flex items-center"
                >
                  Shop Now
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <Product product={product} className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
          </section>

          {/* Special Products Section with Category Filter */}
          <section className="bg-gray-100 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Special Products</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Browse our collection of premium quality stuffed animals, perfect for gifts and special occasions.
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filterProductsByCategory(activeCategory).map((product) => (
                  <div 
                    key={product._id} 
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300"
                  >
                    <Product product={product} className="w-full h-auto object-cover" />
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/shop"
                  className="inline-block bg-purple-600 text-white font-bold py-3 px-10 rounded-full hover:bg-purple-700 transition-colors duration-300 hover:shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </section>

          {/* Testimonials/Featured Reviews Section */}
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Customers Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                    <span className="text-purple-700 font-bold text-xl">J</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Dinura</h4>
                    <div className="flex text-yellow-400">
                      {"★".repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The purple teddy bear I ordered was absolutely perfect! The quality is amazing and the personalization made it such a special gift."
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                    <span className="text-purple-700 font-bold text-xl">M</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Himesh</h4>
                    <div className="flex text-yellow-400">
                      {"★".repeat(4)}{"☆".repeat(1)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I bought the black teddy bear for my daughter's birthday and she absolutely loves it. The quality is excellent and shipping was very fast."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                    <span className="text-purple-700 font-bold text-xl">S</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Aveesha</h4>
                    <div className="flex text-yellow-400">
                      {"★".repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "These teddy bears are the softest plushies I've ever owned. The brown bear is so cuddly and well-made. Will definitely be ordering more!"
                </p>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="bg-purple-600 py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Join Our Newsletter</h2>
              <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                Subscribe to get special offers, free giveaways, and new product announcements.
              </p>
              
              <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="submit"
                  className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full hover:bg-purple-100 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;