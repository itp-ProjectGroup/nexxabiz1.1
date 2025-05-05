// frontend/src/components/Header.jsx
import React from "react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

const Header2 = () => (
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
);

export default Header2;
