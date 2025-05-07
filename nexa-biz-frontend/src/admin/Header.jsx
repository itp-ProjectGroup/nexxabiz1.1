import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarWidth, setSidebarWidth] = useState("256px");

    // Check if we're on the products tab
    const isProductsTab = location.pathname.includes("/admin/products");

    // Listen for sidebar toggle events
    useEffect(() => {
        const handleSidebarToggle = (e) => {
            setSidebarWidth(e.detail.isCollapsed ? "64px" : "256px");
        };

        window.addEventListener("sidebar-toggle", handleSidebarToggle);
        return () => {
            window.removeEventListener("sidebar-toggle", handleSidebarToggle);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        if (location.pathname.includes("/admin/finance")) {
            navigate(`/admin/finance?customer=${searchQuery}`);
        } else if (location.pathname.includes("/admin/orders")) {
            navigate(`/admin/orders?orderId=${searchQuery}`);
        }
        // Products search removed as per requirement
    };

    const getSearchPlaceholder = () => {
        if (location.pathname.includes("/admin/finance")) return "Search customer by name...";
        if (location.pathname.includes("/admin/orders")) return "Search order ID...";
        return "Search...";
    };

    return (
        <header
            className="fixed top-0 right-0 bg-gradient-to-r from-gray-700 to-gray-500 text-white p-4 shadow-md z-50 transition-all duration-300"
            style={{ left: sidebarWidth }}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">NexaBiz Admin</h1>
                </div>

                {/* Conditional rendering: Show navigation text for products tab, search bar for others */}
                {isProductsTab ? (
                    <div className="ml-6 w-full max-w-md">
                    <nav className="flex space-x-8">
                      <NavLink
                        to="/admin/products/add"
                        className={({ isActive }) =>
                          `text-lg  transition-opacity duration-200 ${
                            isActive ? 'text-blue-500 font-bold opacity-100' : 'text-gray-300 opacity-75'
                          }`
                        }
                      >
                        Add Product
                      </NavLink>
                      <NavLink
                        to="/admin/products/all"
                        className={({ isActive }) =>
                          `text-lg transition-opacity duration-200 ${
                            isActive ? 'text-blue-500 font-bold opacity-100' : 'text-gray-300 opacity-75'
                          }`
                        }
                      >
                        View Products
                      </NavLink>
                      <NavLink
                        to="/admin/products/stock"
                        className={({ isActive }) =>
                          `text-lg transition-opacity duration-200 ${
                            isActive ? 'text-blue-500 font-bold opacity-100' : 'text-gray-300 opacity-75'
                          }`
                        }
                      >
                        Stock Levels
                      </NavLink>
                    </nav>
                  </div>

                ) : (
                    <form onSubmit={handleSearch} className="ml-6 w-full max-w-md">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={getSearchPlaceholder()}
                            className="w-full px-4 py-1.5 rounded-full bg-gray-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                        />
                    </form>
                )}

                <div className="flex items-center space-x-4 ml-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Main Site
                        </span>
                    </Link>
                    <div className="flex items-center">
                        <span className="mr-2">Admin</span>
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
