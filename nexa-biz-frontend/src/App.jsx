import { useState } from "react";
import Register from "./pages/Register";

const App = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
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

export default App;
