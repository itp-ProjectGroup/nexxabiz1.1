import { useEffect, useState } from "react"; 
import { useParams, useNavigate  } from "react-router-dom";

import axios from "axios";

const CustomerProfile = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("personal");
    const [formData, setFormData] = useState({
        u_fullName: "",
          u_pEmail: "",
          u_pPhone: "",
          u_p1stLine: "",
          u_p2ndLine: "",
          u_pCity: "",
          u_pCountry: "",
          u_pZip: "",
          u_dob: "",
          u_gender: "",
          u_companyName: "",
          u_businessRegNumber: "",
          u_cEmail: "",
          u_cPhone: "",
          u_c1stLine: "",
          u_c2ndLine: "",
          u_cCity: "",
          u_cCountry: "",
          u_cZip: "",
          username: "",
          password: "",
          confirmPassword: "",
          securityQuestion: "",
          securityAnswer: "",
    });

    // Initialize useNavigate
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/users/${id}`)
            .then(response => {
                const data = response.data;
    
                // Ensure u_dob is properly formatted for input type="date"
                const formattedDob = data.u_dob ? new Date(data.u_dob).toISOString().split("T")[0] : "";
    
                setCustomer(data);
                setFormData({ ...data, u_dob: formattedDob }); // Updating DOB format
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching customer details:", error);
                setLoading(false);
            });
    }, [id]);
    

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.put(`http://localhost:5000/api/users/${id}`, formData);
          if (response.status === 200) {
              alert("Profile updated successfully!");
              // Optionally, you can fetch the updated data again to reflect changes immediately
              const updatedResponse = await axios.get(`http://localhost:5000/api/users/${id}`);
              setCustomer(updatedResponse.data);
              setFormData(updatedResponse.data);
          }
      } catch (error) {
          console.error("Error updating customer:", error);
          alert("Failed to update profile. Please try again.");
      }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            alert("User deleted successfully");

            // Direct navigation after the alert
            navigate("/customers");

        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    }
};


    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (!customer) return <p className="text-center text-red-500">Customer not found</p>;

    return (
        <div className="min-h-screen flex justify-center items-center text-white font-roboto">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-[70rem] mx-auto">
                <div className="flex items-center mb-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mr-4 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold">{customer.u_fullName}'s Profile</h2>
                </div>
                
                {/* Navigation Tabs */}
                <div className="flex mb-6 border-b border-gray-500">
                    {['personal', 'business', 'security'].map(tab => (
                        <button 
                            key={tab} 
                            className={`flex-1 py-2 text-center ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-300'}`} 
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === "personal" && (
                        <>
                            {/* Full Name Input */}
                <div className="mb-2">
                  <label htmlFor="u_fullName" className="block text-gray-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="u_fullName"
                    id="u_fullName"
                    placeholder="John Smith"
                    value={formData.u_fullName}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                </div>

                {/* Email and Phone Input */}
                <div className="flex space-x-4 mb-2">
                  <div className="w-full">
                    <label htmlFor="u_pEmail" className="block text-gray-500">
                      Email
                    </label>
                    <input
                      type="email"
                      name="u_pEmail"
                      id="u_pEmail"
                      placeholder="example@gmail.com"
                      value={formData.u_pEmail}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="u_pPhone" className="block text-gray-500">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="u_pPhone"
                      id="u_pPhone"
                      placeholder="+94111111111"
                      value={formData.u_pPhone}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Address Input */}
                <div className="mb-4">
                  <label htmlFor="u_p1stLine" className="block text-gray-500">
                    Address
                  </label>
                  <input
                    type="text"
                    name="u_p1stLine"
                    id="u_p1stLine"
                    placeholder="1st line"
                    value={formData.u_p1stLine}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                </div>

                {/* Second Line of Address Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="u_p2ndLine"
                    id="u_p2ndLine"
                    placeholder="2nd line"
                    value={formData.u_p2ndLine}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                </div>

                {/* City, Country, and Zip Code Input */}
                <div className="flex space-x-4 mb-2">
                  <div className="w-full">
                    <input
                      type="text"
                      name="u_pCity"
                      id="u_pCity"
                      placeholder="City"
                      value={formData.u_pCity}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="u_pCountry"
                      id="u_pCountry"
                      placeholder="Country"
                      value={formData.u_pCountry}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="number"
                      name="u_pZip"
                      id="u_pZip"
                      placeholder="Zip-code"
                      value={formData.u_pZip}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* Date of Birth and Gender Input */}
                <div className="flex space-x-4 mb-2">
                  <div className="w-full">
                    <label htmlFor="u_dob" className="block text-gray-500">
                      DOB
                    </label>
                    <input
                      type="date"
                      name="u_dob"
                      id="u_dob"
                      value={formData.u_dob}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="u_gender" className="block text-gray-500">
                      Gender
                    </label>
                    <select
                      name="u_gender"
                      id="u_gender"
                      value={formData.u_gender}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                            
                        </>
                    )}

                    {activeTab === "business" && (
                        <>
                {/* Company Name Input */}
                <div className="mb-2">
                  <label htmlFor="u_companyName" className="block text-gray-500">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="u_companyName"
                    id="u_companyName"
                    placeholder="ABC company"
                    value={formData.u_companyName}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>

                {/* Business Registration Number Input */}
                <div className="mb-2">
                  <label htmlFor="u_businessRegNumber" className="block text-gray-500">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    name="u_businessRegNumber"
                    id="u_businessRegNumber"
                    placeholder="00001111"
                    value={formData.u_businessRegNumber}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>

                {/* Company Email and Phone Input */}
                <div className="flex space-x-4 mb-2">
                  <div className="w-full">
                    <label htmlFor="u_cEmail" className="block text-gray-500">
                      Company Email
                    </label>
                    <input
                      type="email"
                      name="u_cEmail"
                      id="u_cEmail"
                      placeholder="example@gmail.com"
                      value={formData.u_cEmail}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="u_cPhone" className="block text-gray-500">
                      Company Phone Number
                    </label>
                    <input
                      type="tel"
                      name="u_cPhone"
                      id="u_cPhone"
                      placeholder="+94111111111"
                      value={formData.u_cPhone}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                {/* Company Address Input */}
                <div className="mb-4">
                  <label htmlFor="u_c1stLine" className="block text-gray-500">
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="u_c1stLine"
                    id="u_c1stLine"
                    placeholder="1st line"
                    value={formData.u_c1stLine}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                </div>

                {/* Second Line of Company Address Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="u_c2ndLine"
                    id="u_c2ndLine"
                    placeholder="2nd line"
                    value={formData.u_c2ndLine}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                </div>

                {/* Company City, Country, and Zip Code Input */}
                <div className="flex space-x-4 mb-2">
                  <div className="w-full">
                    <input
                      type="text"
                      name="u_cCity"
                      id="u_cCity"
                      placeholder="City"
                      value={formData.u_cCity}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="u_cCountry"
                      id="u_cCountry"
                      placeholder="Country"
                      value={formData.u_cCountry}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="number"
                      name="u_cZip"
                      id="u_cZip"
                      placeholder="Zip-code"
                      value={formData.u_cZip}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                </div>



                {/* rates */}
                
                <div className="flex space-x-4 mb-2">
                  <div className="w-full">
                  <label htmlFor="u_c1stLine" className="block text-gray-500">
                    Pricing rate
                  </label>
                    <input
                      type="text"
                      name="u_pricingRate"
                      id="u_pricingRate"
                      placeholder="100%"
                      value={formData.u_pricingRate}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div className="w-full">
                  <label htmlFor="u_c1stLine" className="block text-gray-500">
                    Discount rate
                  </label>
                    <input
                      type="text"
                      name="u_discountRate"
                      id="u_discountRate"
                      placeholder="100%"
                      value={formData.u_discountRate}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                  <div className="w-full">
                  <label htmlFor="u_c1stLine" className="block text-gray-500">
                    Advanced rate
                  </label>
                    <input
                      type="number"
                      name="u_advanceRate"
                      id="u_advanceRate"
                      placeholder="100%"
                      value={formData.u_advanceRate}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                  </div>
                </div>
            </>
                    )}

                    {activeTab === "security" && (
                        <>
                                            {/* Username Input */}
                <div className="mb-2">
                  <label htmlFor="username" className="block text-gray-500">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>

                {/*password and status*/}
                <div className="flex space-x-4 mb-2">
                <div className="w-full">
                  <label htmlFor="password" className="block text-gray-500">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="******"
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="securityQuestion" className="block text-gray-500">
                    Security Question
                  </label>
                  <select
                    name="u_status"
                    id="u_status"
                    value={formData.u_status}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  >
                    <option value="inactive">inactive</option>
                    <option value="Active">Active</option>
                   
                  </select>
                </div>
                </div>

                {/* Security Question Input */}
                <div className="mb-2">
                  <label htmlFor="securityQuestion" className="block text-gray-500">
                    Security Question
                  </label>
                  <select
                    name="securityQuestion"
                    id="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  >
                    <option value="">Select a Security Question</option>
                    <option value="motherMaidenName">What is your mother's maiden name?</option>
                    <option value="firstPet">What was the name of your first pet?</option>
                    <option value="favoriteTeacher">Who was your favorite teacher?</option>
                    <option value="cityBorn">In which city were you born?</option>
                    <option value="highSchoolName">What is the name of your high school?</option>
                    <option value="firstCar">What was the make of your first car?</option>
                  </select>
                </div>

                {/* Security Answer Input */}
                <div className="mb-4">
                  <label htmlFor="securityAnswer" className="block text-gray-500">
                    Security Answer
                  </label>
                  <input
                    type="text"
                    name="securityAnswer"
                    id="securityAnswer"
                    placeholder="Security Answer"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                </div>
                 </>
                    )}
                    <div className="flex justify-end mt-5 space-x-4">
                    <button type="button" onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white px-8 py-2 rounded">Delete</button>
                    <button type="submit" className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-700">Update</button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};

export default CustomerProfile;
