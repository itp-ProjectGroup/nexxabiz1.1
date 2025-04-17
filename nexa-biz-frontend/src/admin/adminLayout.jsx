import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Static Sidebar */}
            <Sidebar />

            {/* Main Content Area with Header */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Static Header */}
                <Header />
                
                {/* Dynamic Content Area */}
                <div className="flex-1 p-6 bg-gradient-to-br from-gray-700 to-gray-500">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
