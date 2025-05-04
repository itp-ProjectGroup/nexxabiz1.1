import React from "react";
import { FaSearch } from "react-icons/fa";

const NAV_LINKS = [
  { name: "Home", href: "#" },
  { name: "Shop", href: "#" },
  { name: "Testimonials", href: "#" },
  { name: "Contact", href: "#" },
];

const WHY_CHOOSING_US = [
  {
    title: "Luxury facilities",
    text:
      "The advantage of hiring a workspace with us is that gives you comfortable service and all-around facilities.",
    link: "#",
  },
  {
    title: "Affordable Price",
    text:
      "You can get a workspace of the highest quality at an affordable price and still enjoy the facilities that are only yours.",
    link: "#",
  },
  {
    title: "Many Choices",
    text:
      "We provide many unique work space choices so that you can choose the workspace to your liking.",
    link: "#",
  },
];

const HomeHeroSection = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white shadow-md">
        <div className="text-2xl font-bold text-[#bd7df0] tracking-wide ml-16">
          Nature Friends
        </div>
        <div className="flex space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-gray-700 hover:text-[#bd7df0] transition-colors duration-200 relative after:block after:h-0.5 after:bg-[#bd7df0] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section
  className="relative flex flex-col items-center justify-center min-h-[600px] w-full bg-cover bg-center"
  style={{
    backgroundImage: "url('https://img.freepik.com/free-photo/cute-teddy-bear-ai-generated-image_268835-5042.jpg')",
  }}
>
  {/* Optional: Add a subtle dark overlay for text readability */}
  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
  <div className="relative z-10 flex flex-col items-center text-center px-4 py-20 w-full">
    <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 drop-shadow-lg">
      Make Your World More <br className="hidden md:block" />
      Cuddly & Charming
    </h1>
    <p className="text-white text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl drop-shadow">
      Bring joy to your space with adorable teddy bears —<br className="hidden sm:block" />
      soft, sweet, and full of love!
    </p>
    {/* Search Bar */}
    <form
      className="flex items-center w-full max-w-md bg-white rounded-full shadow-md px-4 py-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        placeholder="Search Teddy bears"
        className="flex-1 bg-transparent outline-none px-2 py-2 text-gray-700"
      />
      <button
        type="submit"
        className="ml-2 p-2 rounded-full bg-[#bd7df0] hover:bg-[#a86de0] transition-colors text-white"
        aria-label="Search"
      >
        <FaSearch />
      </button>
    </form>
  </div>
</section>

      {/* Dimension Label */}
      <div className="flex justify-center">
        <span className="bg-[#bd7df0] text-white px-4 py-1 rounded-full font-semibold text-sm mt-[-1.5rem] shadow-lg">
          1440 × 1084
        </span>
      </div>

      {/* Why Choosing Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mr-8 mb-4 sm:mb-0">
            Why <br className="sm:hidden" /> Choosing Us
          </h2>
          <div className="flex-1 border-t-2 border-[#bd7df0] sm:mt-0 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WHY_CHOOSING_US.map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow p-8 flex flex-col h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 mb-6 flex-1">{item.text}</p>
              <a
                href={item.link}
                className="text-[#bd7df0] font-semibold hover:underline hover:text-[#a86de0] transition-colors"
              >
                More Info →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeHeroSection;