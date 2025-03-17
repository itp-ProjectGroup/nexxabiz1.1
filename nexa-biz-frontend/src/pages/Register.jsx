import React, { useState } from "react";

const Register = () => {
  const [step, setStep] = useState(1);
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
    securityAnswer: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  


  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleCancel = () => {
    // Reset the form data and return to step 1
    setFormData({
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
      securityAnswer: ""
    });
    setStep(1); // Go back to step 1
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white font-roboto">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl flex">
        <div className="w-1/2 flex items-center justify-center">
          <img
            src="/admin.png"
            alt="Registration"
            className="rounded-lg"
          />
        </div>
        <div className="w-1/2">
        
          <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (  
          <div>
          <h3 className="text-xl font-bold mb-4">Personal Information</h3>

            <div className="mb-2">
              <label htmlFor="fullName" className="block text-gray-500">Full Name</label>
              <input type="text" name="u_fullName" id="u_fullName" placeholder="John Smith" value={formData.u_fullName} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
            </div>

            <div className="flex space-x-4 mb-2">
              <div className="w-full">
                <label htmlFor="email" className="block text-gray-500">Email</label>
                <input type="email" name="u_pEmail" id="u_pEmail" placeholder="example@gmail.com" value={formData.u_pEmail} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
              </div>
              <div className="w-full">
                <label htmlFor="phoneNumber" className="block text-gray-500">Phone Number</label>
                <input type="tel" name="u_pPhone" id="u_pPhone" placeholder="+94111111111" value={formData.u_pPhone} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="address1stLine" className="block text-gray-500">Address</label>
              <input type="text" name="u_p1stLine" id="u_p1stLine" placeholder="1st line" value={formData.u_p1stLine} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
            </div>

            <div className="mb-4">
              <input type="text" name="u_p2ndLine" id="u_p2ndLine" placeholder="2nd line" value={formData.u_p2ndLine} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
            </div>

            <div className="flex space-x-4 mb-2">
              <div className="w-full">
                
                <input type="text" name="u_pCity" id="u_pCity" placeholder="City" value={formData.u_pCity} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
              </div>
              <div className="w-full">
                
                <input type="text" name="u_pCountry" id="u_pCountry" placeholder="Country" value={formData.u_pCountry} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
              </div>
              <div className="w-full">
                
                <input type="number" name="u_pZip" id="u_pZip" placeholder="Zip-code" value={formData.u_pZip} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
              </div>
            </div>


            <div className="flex space-x-4 mb-2">
              <div className="w-full">
                <label htmlFor="dob" className="block text-gray-500">DOB</label>
                <input type="date" name="u_dob" id="u_dob" value={formData.u_dob} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
              </div>
              <div className="w-full">
              <label htmlFor="gender" className="block text-gray-500">Gender</label>
              <select name="u_gender" id="u_gender" value={formData.u_gender} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
                  <button type="button" onClick={handleCancel} className="w-1/2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Cancel</button>
                  <button type="button" onClick={nextStep} className="w-1/2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Next</button>
                </div>
            </div>
            )}

            {step === 2 && (
            <div> 
            <h3 className="text-xl font-bold mb-4">Business Information</h3>
            <div className="mb-2">
                  <label htmlFor="companyName" className="block text-gray-500">Company Name</label>
                  <input type="text" name="u_companyName" id="u_companyName" placeholder="ABC company" value={formData.u_companyName} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
                </div>
                <div className="mb-2">
                  <label htmlFor="businessRegNumber" className="block text-gray-500">Business Registration Number</label>
                  <input type="text" name="u_businessRegNumber" id="u_businessRegNumber" placeholder="00001111" value={formData.u_businessRegNumber} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
                </div>
                <div className="flex space-x-4 mb-2">
              <div className="w-full">
                <label htmlFor="email" className="block text-gray-500">Company Email</label>
                <input type="email" name="u_cEmail" id="u_cEmail" placeholder="example@gmail.com" value={formData.u_cEmail} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
              </div>
              <div className="w-full">
                <label htmlFor="phoneNumber" className="block text-gray-500">Company Phone Number</label>
                <input type="tel" name="u_cPhone" id="u_cPhone" placeholder="+94111111111" value={formData.u_cPhone} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
              </div>
            </div>
                <div className="mb-4">
                  <label htmlFor="address1stLine" className="block text-gray-500">Company Address</label>
                  <input type="text" name="u_c1stLine" id="u_c1stLine" placeholder="1st line" value={formData.u_c1stLine} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
                </div>

            <div className="mb-4">
              <input type="text" name="u_c2ndLine" id="u_c2ndLine" placeholder="2nd line" value={formData.u_c2ndLine} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
            </div>

            <div className="flex space-x-4 mb-2">
              <div className="w-full">
                
                <input type="text" name="u_cCity" id="u_cCity" placeholder="City" value={formData.u_cCity} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
              </div>
              <div className="w-full">
                
                <input type="text" name="u_cCountry" id="u_cCountry" placeholder="Country" value={formData.u_cCountry} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
              </div>
              <div className="w-full">
                
                <input type="number" name="u_cZip" id="u_cZip" placeholder="Zip-code" value={formData.u_cZip} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
                  <button type="button" onClick={prevStep} className="w-1/2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Back</button>
                  <button type="button" onClick={nextStep} className="w-1/2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Next</button>
                </div>
             </div> 
            )}

            {step === 3 && (
              <div>
                 <h3 className="text-xl font-bold mb-4">Account Security</h3>
                 <div className="mb-2">
                  <label htmlFor="username" className="block text-gray-500">Username</label>
                  <input type="text" name="username" id="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
                </div>
                <div className="flex space-x-4 mb-2">
                <div>
                  <label htmlFor="password" className="block text-gray-500">Password</label>
                  <input type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className=" block text-gray-500">Confirm Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" required />
                </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="securityQuestion" className="block text-gray-500">Security Question</label>
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
                <div className="mb-4">
                  <label htmlFor="securityAnswer" className="block text-gray-500">Security Answer</label>
                  <input type="text" name="securityAnswer" id="securityAnswer" placeholder="Security Answer" value={formData.securityAnswer} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
                </div>
                <div className="flex justify-center space-x-4 mt-8">
                  <button type="button" onClick={prevStep} className="w-1/2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Back</button>
                  <button type="submit" className="w-1/2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Submit</button>
                </div>
                </div>
            )}
            
            </form>
        </div>
      </div>
    </div>
  );
};

export default Register;