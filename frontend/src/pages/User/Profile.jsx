import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation, useLogoutMutation } from "../../redux/api/usersApiSlice";
import { setCredentials, logout as logoutAction } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-violet-500 py-8 px-6">
            <div className="flex items-center">
              <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center shadow-md">
                <span className="text-3xl font-bold text-purple-600">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">{username}</h1>
                <p className="text-purple-100">{email}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-100 px-6 py-2 border-b flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-4 font-medium text-sm rounded-t-lg mr-2 ${
                activeTab === "profile"
                  ? "bg-white text-purple-600 shadow-sm border-t border-l border-r border-gray-200"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-3 px-4 font-medium text-sm rounded-t-lg ${
                activeTab === "security"
                  ? "bg-white text-purple-600 shadow-sm border-t border-l border-r border-gray-200"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Security
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm flex items-center text-purple-600 hover:text-purple-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex border-b border-gray-200 py-3">
                      <span className="text-gray-600 w-1/3">Name</span>
                      <span className="text-gray-900 w-2/3 font-medium">{username}</span>
                    </div>
                    <div className="flex border-b border-gray-200 py-3">
                      <span className="text-gray-600 w-1/3">Email</span>
                      <span className="text-gray-900 w-2/3 font-medium">{email}</span>
                    </div>
                    <div className="flex pt-3">
                      <span className="text-gray-600 w-1/3">Member Since</span>
                      <span className="text-gray-900 w-2/3 font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Link
                        to="/user-orders"
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submitHandler} className="space-y-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                    {loadingUpdateProfile && (
                      <div className="flex justify-center">
                        <Loader />
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
                <form onSubmit={submitHandler} className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                  {loadingUpdateProfile && (
                    <div className="flex justify-center">
                      <Loader />
                    </div>
                  )}
                </form>

                <div className="mt-12 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Account Actions</h3>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;