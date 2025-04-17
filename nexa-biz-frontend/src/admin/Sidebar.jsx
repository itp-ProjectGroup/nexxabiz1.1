import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    
    // Function to check if a link is active
    const isActive = (path) => {
        if (path === "/admin" && location.pathname === "/admin") {
            return true;
        }
        return location.pathname.startsWith(path) && path !== "/admin";
    };
    
    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-5 fixed">
            <div className="flex justify-center mb-6">
                <img src="/logo.png" alt="NexaBiz Logo" className="h-25 w-auto" />
            </div>
            <ul className="mt-5 space-y-4">
                <li>
                    <Link 
                        to="/admin" 
                        className={`block p-2 relative transition-all duration-300 group ${
                            isActive("/admin") 
                                ? "text-blue-400 font-medium" 
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        {isActive("/admin") && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin") && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className="flex items-center justify-between">
                                <span>Dashboard</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/admin/customers" 
                        className={`block p-2 relative transition-all duration-300 group ${
                            isActive("/admin/customers") 
                                ? "text-blue-400 font-medium" 
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        {isActive("/admin/customers") && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin/customers") && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className="flex items-center justify-between">
                                <span>Customers</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/admin/orders" 
                        className={`block p-2 relative transition-all duration-300 group ${
                            isActive("/admin/orders") 
                                ? "text-blue-400 font-medium" 
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        {isActive("/admin/orders") && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin/orders") && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className="flex items-center justify-between">
                                <span>Orders</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/admin/settings" 
                        className={`block p-2 relative transition-all duration-300 group ${
                            isActive("/admin/settings") 
                                ? "text-blue-400 font-medium" 
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        {isActive("/admin/settings") && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin/settings") && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className="flex items-center justify-between">
                                <span>Settings</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
