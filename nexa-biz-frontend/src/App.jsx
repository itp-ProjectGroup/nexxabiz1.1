import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CustomerList from "./pages/CustomerList";
import CustomerProfile from "./pages/CustomerProfile";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/customer/:id" element={<CustomerProfile />} />
            </Routes>
        </Router>
    );
};

export default App;
