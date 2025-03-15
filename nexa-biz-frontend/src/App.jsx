import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Ensure correct import

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />  {/* Fixed Home Page Path */}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
