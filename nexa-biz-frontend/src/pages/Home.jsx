import { useState } from "react";
import Register from "../pages/Register"; // Adjust the path if necessary

const Home = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to My Website</h1>
        <p className="mt-2 text-gray-600">This is the home page.</p>

        <button 
            onClick={() => setIsRegisterOpen(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
            Open Register Form
        </button>

        {isRegisterOpen && <Register onClose={() => setIsRegisterOpen(false)} />}
      </div>
    );
};

export default Home;
