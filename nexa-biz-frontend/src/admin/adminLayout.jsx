import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Sidebar";

const AdminLayout = () => {
    return (
        <div className="flex">
            {/* Static Sidebar */}
            <Sidebar />

            {/* Dynamic Content Area */}
            <div className="flex-1 p-5">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
