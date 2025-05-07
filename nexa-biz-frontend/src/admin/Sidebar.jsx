import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Function to check if a link is active
    const isActive = (path) => {
        if (path === "/admin" && location.pathname === "/admin") {
            return true;
        }
        return location.pathname.startsWith(path) && path !== "/admin";
    };
    
    const toggleSidebar = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        
        // Dispatch custom event for the AdminLayout and Header
        window.dispatchEvent(
            new CustomEvent("sidebar-toggle", { 
                detail: { isCollapsed: newCollapsedState } 
            })
        );
    };
    
    // Dispatch event on initial load to ensure synced state
    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("sidebar-toggle", { 
                detail: { isCollapsed: isCollapsed } 
            })
        );
    }, []);

    // Effect to update the main content margin when sidebar state changes
    useEffect(() => {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = isCollapsed ? '64px' : '256px';
        }
    }, [isCollapsed]);
    
    return (
        <div 
            className={`transition-all duration-300 h-screen bg-gray-800 text-white p-5 fixed ${
                isCollapsed ? "w-16" : "w-64"
            }`}
        >
            {/* Toggle Button */}
            <div className="flex justify-end mb-4">
                <button 
                    onClick={toggleSidebar} 
                    className="text-gray-300 hover:text-white p-1 rounded-md transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {/* Use an arrow icon for expanding/collapsing */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {/* If collapsed, show a right arrow to expand, otherwise show a left arrow to collapse */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                    </svg>
                </button>
            </div>
            
            {/* Logo section - only shown when expanded */}
            <div className="flex justify-center mb-6">
                {!isCollapsed && (
                    <Link to="/">
                        <img src="/logo.png" alt="NexaBiz Logo" className="h-28 w-auto cursor-pointer" />
                    </Link>
                )}
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
                        {isActive("/admin") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                                {!isCollapsed && <span>Dashboard</span>}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 min-w-6 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
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
                        {isActive("/admin/customers") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin/customers") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                                {!isCollapsed && <span>Customers</span>}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 min-w-6 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </li>

                {/* Product management */}
                <li>
    <Link
        to="/admin/products"
        className={`block p-2 relative transition-all duration-300 group ${
            isActive("/admin/products")
                ? "text-blue-400 font-medium"
                : "text-gray-300 hover:text-white"
        }`}
    >
        {isActive("/admin/products") && !isCollapsed && (
            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
        )}
        {!isActive("/admin/products") && !isCollapsed && (
            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
        )}
        <div className="relative z-10">
            <span className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                {!isCollapsed && <span>Products</span>}
                {/* Box icon (Product icon) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 min-w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 2a1 1 0 00-1 1v2H3a1 1 0 100 2h1v13a2 2 0 002 2h12a2 2 0 002-2V7h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm1 3V4h10v1H7zm2 5a1 1 0 112 0v2a1 1 0 11-2 0v-2zm6 0a1 1 0 112 0v2a1 1 0 11-2 0v-2z" />
                </svg>
            </span>
        </div>
    </Link>
</li>


                {/* order management */}
                <li>
                    <Link 
                        to="/admin/orders" 
                        className={`block p-2 relative transition-all duration-300 group ${
                            isActive("/admin/orders") 
                                ? "text-blue-400 font-medium" 
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        {isActive("/admin/orders") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin/orders") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                                {!isCollapsed && <span>Orders</span>}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 min-w-6 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </li>

                {/* finance management */}
                <li>
                    <Link 
                        to="/admin/finance" 
                        className={`block p-2 relative transition-all duration-300 group ${
                            isActive("/admin/finance") 
                                ? "text-blue-400 font-medium" 
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        {isActive("/admin/finance") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin/finance") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                                {!isCollapsed && <span>Financials</span>}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 min-w-6 flex-shrink-0">
                                    <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                                    <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
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
                        {isActive("/admin/settings") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400"></span>
                        )}
                        {!isActive("/admin/settings") && !isCollapsed && (
                            <span className="absolute left-0 top-0 h-full w-0 bg-blue-400/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                        )}
                        <div className="relative z-10">
                            <span className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                                {!isCollapsed && <span>Settings</span>}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 min-w-6 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
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