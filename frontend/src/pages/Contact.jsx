import Header2 from "../components/Header2";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <Header2 />
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 mt-2">CONTACT US</h1>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Left: Bear Image */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center w-full md:w-1/2">
            <img
              src="https://img.freepik.com/free-photo/fluffy-toy-texture-close-up_23-2149686878.jpg" // <-- update this path to your actual bear image path
              alt="Black Teddy Bear"
              className="max-h-96 w-auto object-contain"
            />
          </div>
          {/* Right: Contact Info and Careers */}
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            <div>
              <h2 className="text-2xl font-bold mb-2">Our Store</h2>
              <p>372/A Siriketha Road, Heiyanthuduwa</p>
              <p>Tel: (011) 456-7890</p>
              <p>Email: <a href="mailto:support@naturefriends.com" className="text-purple-700 hover:underline">support@naturefriends.com</a></p>
            </div>
            <div className="bg-[#f6ede3] rounded-xl p-6 shadow">
              <h3 className="text-xl font-bold mb-2">Careers at Nature Friends</h3>
              <p className="mb-4">
                Discover opportunities to join our teddy bear crafting team and explore job openings.
              </p>
              <a
                href="#"
                className="inline-block px-6 py-2 bg-white border-2 border-purple-400 text-purple-700 font-semibold rounded-full hover:bg-purple-100 transition"
              >
                View Opportunities
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 