import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = () => {
    const [sidebarWidth, setSidebarWidth] = useState("256px"); // Default width when expanded

    // Listen for custom event from Sidebar to update layout
    useEffect(() => {
        const handleSidebarToggle = (e) => {
            setSidebarWidth(e.detail.isCollapsed ? "64px" : "256px");
        };

        window.addEventListener("sidebar-toggle", handleSidebarToggle);
        return () => {
            window.removeEventListener("sidebar-toggle", handleSidebarToggle);
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Static Sidebar */}
            <Sidebar />
            
            {/* Main Content Area with Header */}
            <div 
                className="main-content flex-1 flex flex-col transition-all duration-300"
                style={{ marginLeft: sidebarWidth }}
            >
                {/* Header is now self-positioning based on sidebar width */}
                <Header />
                
                {/* Dynamic Content Area */}
                <div className="flex-1 pt-20 p-6 bg-gradient-to-br from-gray-700 to-gray-500">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;