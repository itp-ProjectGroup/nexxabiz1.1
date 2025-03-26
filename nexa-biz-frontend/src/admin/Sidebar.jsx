import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-5 fixed">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <ul className="mt-5 space-y-4">
                <li>
                    <Link to="/admin" className="block p-2 hover:bg-gray-700">Dashboard</Link>
                </li>
                <li>
                    <Link to="/admin/customers" className="block p-2 hover:bg-gray-700">Customers</Link>
                </li>
                <li>
                    <Link to="/admin/orders" className="block p-2 hover:bg-gray-700">Orders</Link>
                </li>
                <li>
                    <Link to="/admin/settings" className="block p-2 hover:bg-gray-700">Settings</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
