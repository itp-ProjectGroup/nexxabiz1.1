import { useState } from "react";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        u_businessname: "",
        u_email: "",
        u_phoneNo: "",
        u_address: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/users/register", formData);
            alert(response.data.message); // Show success message
            setFormData({ u_businessname: "", u_email: "", u_phoneNo: "", u_address: "" }); // Reset form
        } catch (error) {
            alert("Registration failed! Check console for details.");
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="u_businessname"
                    placeholder="Business Name"
                    value={formData.u_businessname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="u_email"
                    placeholder="Email"
                    value={formData.u_email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="u_phoneNo"
                    placeholder="Phone Number"
                    value={formData.u_phoneNo}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="u_address"
                    placeholder="Address"
                    value={formData.u_address}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
