import React, { useState } from "react";
import Register from "./Register";

const Home = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to Home Page</h1>
      <button
        onClick={() => setIsRegisterOpen(true)}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Open Register
      </button>

      {/* Show Register Modal if isRegisterOpen is true */}
      {isRegisterOpen && <Register onClose={() => setIsRegisterOpen(false)} />}
    </div>
  );
};

export default Home;
