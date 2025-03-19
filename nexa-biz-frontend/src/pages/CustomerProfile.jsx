import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CustomerProfile = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/users/${id}`)
            .then(response => {
                setCustomer(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching customer details:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    if (!customer) return <p className="text-center text-red-500">Customer not found</p>;

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">{customer.u_fullName}'s Profile</h2>
            <div className="bg-white p-6 shadow-lg rounded-lg">
                <p><strong>Email:</strong> {customer.u_pEmail}</p>
                <p><strong>Phone:</strong> {customer.u_pPhone}</p>
                <p><strong>Company:</strong> {customer.u_companyName || "N/A"}</p>
                <p><strong>Business Registration Number:</strong> {customer.u_businessRegNumber || "N/A"}</p>
                <p><strong>Status:</strong> {customer.u_status}</p>
                <p><strong>Address:</strong> {customer.u_p1stLine}, {customer.u_pCity}, {customer.u_pCountry}, {customer.u_pZip}</p>
            </div>
        </div>
    );
};

export default CustomerProfile;
