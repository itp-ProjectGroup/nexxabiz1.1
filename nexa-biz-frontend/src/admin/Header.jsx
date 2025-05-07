import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarWidth, setSidebarWidth] = useState("256px");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New order #1234 received", isRead: false, time: "10m ago" },
        { id: 2, text: "Stock low alert: Product XYZ", isRead: false, time: "25m ago" },
        { id: 3, text: "Payment processed for order #1201", isRead: true, time: "1h ago" }
    ]);

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

    // Toggle dark mode and save preference
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    // Load dark mode preference
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchQuery.trim() === "") return;

        if (location.pathname.includes("/admin/finance")) {
            navigate(`/admin/finance?customer=${searchQuery}`);
        } else if (location.pathname.includes("/admin/orders")) {
            navigate(`/admin/orders?orderId=${searchQuery}`);
        }
        // Reset search after submission
        setSearchQuery("");
    };

    const getSearchPlaceholder = () => {
        if (location.pathname.includes("/admin/finance")) return "Search customer by name...";
        if (location.pathname.includes("/admin/orders")) return "Search order ID...";
        return "Search...";
    };

    const handleNotificationClick = (id) => {
        setNotifications(notifications.map(notif => 
            notif.id === id ? { ...notif, isRead: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const toggleDropdown = (dropdown) => {
        if (dropdown === 'notifications') {
            setShowNotifications(!showNotifications);
            if (showUserMenu) setShowUserMenu(false);
        } else if (dropdown === 'userMenu') {
            setShowUserMenu(!showUserMenu);
            if (showNotifications) setShowNotifications(false);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifications || showUserMenu) {
                if (!event.target.closest('.dropdown-container')) {
                    setShowNotifications(false);
                    setShowUserMenu(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications, showUserMenu]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const headerBgClass = darkMode 
        ? "bg-gray-900 text-white" 
        : "bg-gradient-to-r from-gray-700 to-gray-500 text-white";

    return (
        <header
            className={`fixed top-0 right-0 ${headerBgClass} p-4 shadow-md z-50 transition-all duration-300`}
            style={{ left: sidebarWidth }}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">NexaBiz Admin</h1>
                </div>

                {/* Conditional rendering: Show navigation buttons for products tab, search bar for others */}
                {isProductsTab ? (
                    <div className="ml-6 w-full max-w-md">
                        <nav className="flex space-x-4">
                            <NavLink
                                to="/admin/products/add"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        isActive
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-gray-600 text-white hover:bg-gray-500'
                                    }`
                                }
                            >
                                Add Product
                            </NavLink>
                            <NavLink
                                to="/admin/products/all"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        isActive
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-gray-600 text-white hover:bg-gray-500'
                                    }`
                                }
                            >
                                View Products
                            </NavLink>
                            <NavLink
                                to="/admin/products/stock"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        isActive
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-gray-600 text-white hover:bg-gray-500'
                                    }`
                                }
                            >
                                Stock Levels
                            </NavLink>
                        </nav>
                    </div>
                ) : (
                    <form onSubmit={handleSearch} className="ml-6 w-full max-w-md group relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={getSearchPlaceholder()}
                            className="w-full px-4 py-1.5 pr-10 rounded-full bg-gray-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                        />
                        <button 
                            type="submit" 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </form>
                )}

                <div className="flex items-center space-x-4 ml-6">
                    {/* Theme toggle */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-600"
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="dropdown-container relative">
                        <button 
                            onClick={() => toggleDropdown('notifications')} 
                            className="text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-600 relative"
                            aria-label="Notifications"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <h3 className="font-medium">Notifications</h3>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Mark all read
                                        </button>
                                        <button 
                                            onClick={clearNotifications}
                                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="max-h-60 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(notification => (
                                        <div 
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id)}
                                            className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                        >
                                            <div className="flex justify-between">
                                                <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>{notification.text}</p>
                                                {!notification.isRead && (
                                                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                                        </div>
                                    )) : (
                                        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                            <p>No notifications</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main site link */}
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
            
                        </span>
                    </Link>

                    {/* User menu */}
                    <div className="dropdown-container relative">
                        <button 
                            onClick={() => toggleDropdown('userMenu')}
                            className="flex items-center space-x-2 hover:bg-gray-600 p-1 rounded-full transition-colors cursor-pointer"
                        >
                            <span className="text-sm mr-1 hidden sm:inline">Demo</span>
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white font-bold">A</span>
                            </div>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-medium">Admin User</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">admin@nexabiz.com</p>
                                </div>
                                <Link 
                                    to="/admin/profile" 
                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Your Profile
                                </Link>
                                <Link 
                                    to="/admin/settings" 
                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Settings
                                </Link>
                                <Link 
                                    to="/logout" 
                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-500"
                                >
                                    Sign out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;