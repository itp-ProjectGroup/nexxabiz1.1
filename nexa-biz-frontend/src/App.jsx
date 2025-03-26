import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CustomerList from "./pages/CustomerList";
import CustomerProfile from "./pages/CustomerProfile";
import OrderList from "./pages/OrderList";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/customer/:id" element={<CustomerProfile />} />
                <Route path="/OrderList" element={<OrderList />} />
            </Routes>
        </Router>
    );
};

export default App;
