import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import Header2 from "../components/Header2";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true
  });

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  // Optimized search: filter products by name (case-insensitive)
  const searchedProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const resetFilters = () => {
    window.location.reload();
  };

  // SVG Icons as components
  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );

  const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );

  const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header2 />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">
            Discover Our Collection
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Find the perfect products that match your style
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full border border-black bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
            />
            <span className="absolute left-4 top-3.5 text-gray-400">
              <SearchIcon />
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium"
          >
            <span className="mr-2">
              <FilterIcon />
            </span>
            {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Section - collapsible on mobile */}
          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
            <div className="sticky top-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-purple-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">
                    <FilterIcon />
                  </span>
                  Filters
                </h2>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                >
                  <span className="mr-1">
                    <XIcon />
                  </span>
                  Reset
                </button>
              </div>

              {/* Categories Section */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => toggleSection('categories')}
                  className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Categories</span>
                  {expandedSections.categories ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                
                {expandedSections.categories && (
                  <div className="px-4 pb-4">
                    {categories?.map((c) => (
                      <div key={c._id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`category-${c._id}`}
                          onChange={(e) => handleCheck(e.target.checked, c._id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`category-${c._id}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-purple-600"
                        >
                          {c.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brands Section */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => toggleSection('brands')}
                  className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Brands</span>
                  {expandedSections.brands ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                
                {expandedSections.brands && (
                  <div className="px-4 pb-4">
                    {uniqueBrands?.map((brand) => (
                      <div key={brand} className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`brand-${brand}`}
                          name="brand"
                          onChange={() => handleBrandClick(brand)}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-purple-600"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div>
                <button 
                  onClick={() => toggleSection('price')}
                  className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Price</span>
                  {expandedSections.price ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                
                {expandedSections.price && (
                  <div className="px-4 pb-4">
                    <input
                      type="text"
                      placeholder="Enter Price"
                      value={priceFilter}
                      onChange={handlePriceChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2">
                  <ShoppingBagIcon />
                </span>
                Products
                <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {searchedProducts?.length}
                </span>
              </h2>
              
              <div className="text-sm text-gray-500">
                Showing {searchedProducts?.length} results
              </div>
            </div>

            {searchedProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchedProducts?.map((p) => (
                  <div key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;