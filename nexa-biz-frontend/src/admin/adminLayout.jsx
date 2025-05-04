import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Listen for custom event from Sidebar to update layout
    useEffect(() => {
        const handleSidebarToggle = (e) => {
            setIsCollapsed(e.detail.isCollapsed);
        };

        window.addEventListener("sidebar-toggle", handleSidebarToggle);
        return () => {
            window.removeEventListener("sidebar-toggle", handleSidebarToggle);
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar with fixed positioning */}
            <div className={`fixed top-0 left-0 z-20 h-full transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
                <Sidebar />
            </div>
            
            {/* Main Content Area - takes full width with left padding for sidebar */}
            <div className="w-full min-h-screen">
                {/* This spacer div creates space for the sidebar */}
                <div className={`fixed top-0 left-0 h-full transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}></div>
                
                {/* Content container that fills remaining space */}
                <div className="flex flex-col min-h-screen transition-all duration-300"
                    style={{ paddingLeft: isCollapsed ? "4rem" : "16rem" }}>
                    {/* Header spans full width of available space */}
                    <Header />
                    
                    {/* Dynamic Content Area */}
                    <div className="flex-1 pt-20 p-6 bg-gradient-to-br from-gray-700 to-gray-500">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;