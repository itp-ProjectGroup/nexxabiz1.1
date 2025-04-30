import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CustomerList from "./pages/CustomerList";
import CustomerProfile from "./pages/CustomerProfile";
import OrderList from "./pages/OrderList";
import FinDashboard from "./pages/FinDashboard";
import PaymentGateway  from "./pages/paymentGateway";
import HeroSection from "./pages/HeroSection";
import AdminLayout from "./admin/adminLayout";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/OrderList" element={<OrderList />} />
                <Route path="payment/:orderId" element={<PaymentGateway />} />
                <Route path="/HeroSection" element={<HeroSection />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<div>Admin Dashboard</div>} />
                    <Route path="customers" element={<CustomerList />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="finance" element={<FinDashboard />} />
                    <Route path="payment/:orderId" element={<PaymentGateway />} />
                    <Route path="customer/:id" element={<CustomerProfile />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
