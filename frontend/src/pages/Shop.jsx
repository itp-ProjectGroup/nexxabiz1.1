import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
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

  return (
    <>
      <Header2 />
      {/* Search Bar */}
      <div className="w-full flex justify-center bg-white pt-8 pb-4 shadow">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-[#bd7df0] transition"
        />
      </div>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-white p-3 mt-2 mb-2 shadow-md border border-gray-200">
            <h2 className="h4 text-center py-2 bg-gray-100 text-gray-800 rounded-full mb-2">
              Filter by Categories
            </h2>
            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-[#bd7df0] bg-gray-100 border-gray-300 rounded focus:ring-[#bd7df0]"
                    />
                    <label
                      htmlFor="pink-checkbox"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="h4 text-center py-2 bg-gray-100 text-gray-800 rounded-full mb-2">
              Filter by Brands
            </h2>
            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <>
                  <div className="flex items-center mr-4 mb-5">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-[#bd7df0] bg-gray-100 border-gray-300 focus:ring-[#bd7df0]"
                    />
                    <label
                      htmlFor="pink-radio"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      {brand}
                    </label>
                  </div>
                </>
              ))}
            </div>
            <h2 className="h4 text-center py-2 bg-gray-100 text-gray-800 rounded-full mb-2">
              Filter by Price
            </h2>
            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-[#bd7df0] bg-white"
              />
            </div>
            <div className="p-5 pt-0">
              <button
                className="w-full border border-gray-300 my-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="p-3">
            <h2 className="h4 text-center mb-2">{searchedProducts?.length} Products</h2>
            <div className="flex flex-wrap">
              {searchedProducts.length === 0 ? (
                <Loader />
              ) : (
                searchedProducts?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
