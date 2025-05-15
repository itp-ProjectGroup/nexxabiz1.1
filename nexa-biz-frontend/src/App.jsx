import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CustomerList from "./pages/CustomerList";
import CustomerProfile from "./pages/CustomerProfile";
import OrderList from "./pages/OrderList";
import FinDashboard from "./pages/finDashboard";
import HeroSection from "./pages/HeroSection";
import AdminLayout from "./admin/adminLayout";
import ProductForm from "./pages/ProductForm";
import ProductList from "./pages/ProductList";
import MainDashboard from "./pages/MainDashboard";
import Stock from "./pages/Stock";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/OrderList" element={<OrderList />} />
                <Route path="/HeroSection" element={<HeroSection />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<MainDashboard />} />
                    <Route path="customers" element={<CustomerList />} />
                    <Route path="products" element={<Stock />} />
                    <Route path="/admin/products/add" element={<ProductForm />} />
                    <Route path="/admin/products/all" element={<ProductList />} />
                    <Route path="/admin/products/stock" element={<Stock />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="finance" element={<FinDashboard />} />
                    <Route path="customer/:id" element={<CustomerProfile />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
