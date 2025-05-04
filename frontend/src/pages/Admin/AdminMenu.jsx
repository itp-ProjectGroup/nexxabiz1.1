import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-white p-2 fixed rounded-lg shadow-md border border-gray-200`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes className="text-gray-800" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-gray-600 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 my-1"></div>
          </>
        )}
      </button>

      {isMenuOpen && (
        <section className="bg-white p-4 fixed right-7 top-5 shadow-md border border-gray-200">
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-100 rounded-sm text-gray-800"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "#bd7df0" : "gray-800",
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-100 rounded-sm text-gray-800"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "#bd7df0" : "gray-800",
                })}
              >
                Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-100 rounded-sm text-gray-800"
                to="/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? "#bd7df0" : "gray-800",
                })}
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-100 rounded-sm text-gray-800"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "#bd7df0" : "gray-800",
                })}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-100 rounded-sm text-gray-800"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "#bd7df0" : "gray-800",
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-100 rounded-sm text-gray-800"
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? "#bd7df0" : "gray-800",
                })}
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
