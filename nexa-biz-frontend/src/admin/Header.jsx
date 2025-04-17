import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-gray-700 to-gray-500 text-white p-4 shadow-md">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">NexaBiz Admin</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Main Site
                        </span>
                    </Link>
                    <div className="flex items-center">
                        <span className="mr-2">Admin</span>
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 