import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    useEffect(() => {
        axios.get("http://localhost:5000/api/users")
            .then(response => {
                setCustomers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching customers:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto mt-10 font-roboto bg-gray-800 text-white p-6 rounded-lg shadow-lg">
           
            <div className="overflow-x-auto p-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm text-center">
                            <th className="py-3 px-4 ">User ID</th>
                            <th className="py-3 px-4">Business name</th>
                            <th className="py-3 px-4">Owner name</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.userID} className="border-b border-gray-700 hover:bg-gray-800 text-center">
                                <td className="py-3 px-4 font-medium text-white">{customer.userID }</td>
                                <td className="py-3 px-4 text-gray-300">{customer.u_companyName || "N/A"}</td>
                                <td className="py-3 px-4 text-gray-300">{customer.u_fullName || "N/A"}</td>
                                <td className="py-3 px-4">
                                <span className={`px-3 py-1 inline-flex justify-center items-center w-24 rounded-full text-sm font-medium ${customer.u_status === "Active" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                    {customer.u_status}
                                </span>
                                </td>
                                <td className="py-3 px-4">
                                    <Link 
                                        to={isAdminRoute ? `/admin/customer/${customer.userID}` : `/customer/${customer.userID}`} 
                                        className="text-blue-400 hover:underline"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default CustomerList;
