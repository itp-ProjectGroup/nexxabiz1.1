import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Static Sidebar */}
            <Sidebar />

            {/* Dynamic Content Area */}
            <div className="flex-1 ml-64 p-6 bg-gradient-to-br from-gray-700 to-gray-500">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
