import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
    return (
        <div className="flex">
            {/* Static Sidebar */}
            <Sidebar />

            {/* Dynamic Content Area */}
            <div className="flex-1 ml-64 p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
