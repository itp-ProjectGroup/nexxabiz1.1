import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header2 from "../components/Header2";

const Testimonials = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [feedbacks, setFeedbacks] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formErrors, setFormErrors] = useState("");
  const [animation, setAnimation] = useState(false);

  // Load testimonials with some example data if none exist yet
  useEffect(() => {
    if (feedbacks.length === 0) {
      setFeedbacks([
        {
          id: 1,
          user: "Sarah Johnson",
          userId: "user1",
          text: "I absolutely love the purple teddy bear! The quality is exceptional and my daughter hasn't put it down since it arrived. Definitely purchasing more for gifts!",
          rating: 5,
          date: "2024-05-01"
        },
        {
          id: 2,
          user: "Michael Chen",
          userId: "user2",
          text: "The black bear arrived promptly and looks exactly like the pictures. Very soft material and nice stitching. Highly recommend for anyone looking for quality plush toys.",
          rating: 4,
          date: "2024-04-25"
        }
      ]);
    }
  }, [feedbacks.length]);

  // Add or update feedback
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setFormErrors("Please enter your feedback");
      return;
    }
    
    if (editId) {
      setFeedbacks(feedbacks.map(f =>
        f.id === editId ? { ...f, text, rating } : f
      ));
      setEditId(null);
    } else {
      const newFeedback = {
        id: Date.now(),
        user: userInfo.username,
        userId: userInfo._id,
        text,
        rating,
        date: new Date().toISOString().split('T')[0]
      };
      
      setFeedbacks([newFeedback, ...feedbacks]);
      setAnimation(true);
      setTimeout(() => setAnimation(false), 500);
    }
    
    setText("");
    setRating(5);
    setFormErrors("");
  };

  // Edit feedback
  const handleEdit = (id) => {
    const fb = feedbacks.find(f => f.id === id);
    setText(fb.text);
    setRating(fb.rating || 5);
    setEditId(id);
    
    // Scroll to form
    document.getElementById('feedback-form').scrollIntoView({ behavior: 'smooth' });
  };

  // Delete feedback with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setFeedbacks(feedbacks.filter(f => f.id !== id));
      if (editId === id) {
        setEditId(null);
        setText("");
        setRating(5);
      }
    }
  };

  // Render stars for rating input
  const renderRatingStars = (interactive = false) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${
              interactive
                ? (star <= (hoveredRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300")
                : ""
            }`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Render stars for display
  const renderStars = (count) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < count ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header2 />
      
      {/* Hero Section */}
      <div className="bg-purple-700 text-white py-12 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Customer Testimonials</h1>
          <p className="text-purple-100 max-w-2xl mx-auto">
            Read what our valued customers have to say about their experiences with our products.
            We appreciate all feedback as it helps us improve and provide better service.
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Feedback Form */}
        {userInfo ? (
          <div id="feedback-form" className="bg-white rounded-lg shadow-lg p-6 mb-10 transition-all duration-300 ease-in-out">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">
              {editId ? "Edit Your Review" : "Share Your Experience"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Your Rating
                </label>
                {renderRatingStars(true)}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Your Feedback
                </label>
                <textarea
                  className={`w-full p-3 border ${formErrors ? 'border-red-500' : 'border-gray-300'} rounded-lg mb-1 text-black text-sm sm:text-base focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all`}
                  placeholder="Tell us about your experience..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={4}
                ></textarea>
                {formErrors && <p className="text-red-500 text-xs italic">{formErrors}</p>}
              </div>
              
              <div className="flex justify-end gap-2">
                {editId && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 transition-colors"
                    onClick={() => { setEditId(null); setText(""); setRating(5); }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editId ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-10 text-center">
            <svg className="w-16 h-16 text-purple-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Please Log In To Leave Feedback</h2>
            <p className="text-gray-500">
              We'd love to hear your thoughts about our products. Please log in to share your experience.
            </p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-4 border-b border-gray-200 pb-2">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            Customer Reviews
            <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {feedbacks.length}
            </span>
          </h2>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {feedbacks.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <p className="text-lg">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
          
          {feedbacks.map((fb, index) => (
            <div 
              key={fb.id} 
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all ${index === 0 && animation ? 'animate-pulse bg-purple-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold mr-3">
                    {fb.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{fb.user}</h3>
                    <div className="flex items-center">
                      {renderStars(fb.rating || 5)}
                      {fb.date && <span className="ml-2 text-xs text-gray-500">{fb.date}</span>}
                    </div>
                  </div>
                </div>
                
                {userInfo && fb.userId === userInfo._id && (
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:bg-blue-50 p-1 rounded-full transition-colors"
                      onClick={() => handleEdit(fb.id)}
                      aria-label="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      className="text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors"
                      onClick={() => handleDelete(fb.id)}
                      aria-label="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-gray-700 text-sm sm:text-base">
                <p>{fb.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;