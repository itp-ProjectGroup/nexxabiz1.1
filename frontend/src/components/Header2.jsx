// frontend/src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

const Header2 = () => {
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const favoriteCount = favorites.length;

  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-4"
      style={{
        background: "linear-gradient(90deg, #fff 0%, #f0f0f0 100%)",
        minHeight: "64px",
      }}
    >
      {/* Logo */}
      <div className="text-2xl font-bold italic text-black tracking-wide" style={{fontFamily: 'inherit'}}>
        Nature Friends
      </div>
      {/* Nav Links */}
      <div className="flex space-x-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className={`text-lg font-semibold transition-colors duration-200 ${
              location.pathname === link.href
                ? "text-[#bd7df0] font-bold"
                : "text-black hover:text-[#bd7df0]"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      {/* Icons */}
      <div className="flex items-center space-x-6 mr-4">
        {/* Cart */}
        <Link to="/cart" className="relative">
          <AiOutlineShoppingCart size={26} className="text-black" />
          <span className="absolute -top-2 -right-3 bg-[#bd7df0] text-white text-xs px-1.5 py-0.5 rounded-full">
            {cartCount}
          </span>
        </Link>
        {/* Favorites */}
        <Link to="/favorite" className="relative">
          <FaHeart size={22} className="text-black" />
          {favoriteCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-[#bd7df0] text-white text-xs px-1.5 py-0.5 rounded-full">
              {favoriteCount}
            </span>
          )}
        </Link>
        {/* User */}
        <Link to={userInfo ? "/profile" : "/login"}>
          <AiOutlineUser size={24} className="text-black" />
        </Link>
      </div>
    </nav>
  );
};

export default Header2;
