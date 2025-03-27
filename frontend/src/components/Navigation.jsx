import { NavLink } from 'react-router-dom';

function Navigation() {
    return (
        <nav className="flex space-x-4 p-4">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isActive
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/add"
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
                to="/all"
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
        </nav>
    );
}

export default Navigation;
