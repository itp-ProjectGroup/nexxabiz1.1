import { NavLink } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="flex space-x-4 p-4 bg-white shadow-sm">
            <NavLink
                to="/admin/products/add"
                className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isActive
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
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
                            : 'bg-white text-gray-700 hover:bg-gray-100'
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
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`
                }
            >
                stock levels
            </NavLink>
        </nav>
    );
}

export default Navigation;
