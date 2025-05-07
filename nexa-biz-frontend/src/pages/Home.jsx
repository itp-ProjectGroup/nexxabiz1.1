import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Menu, X, Linkedin, Twitter, Facebook, Instagram, ChevronUp } from 'lucide-react';

// App Component
export default function NexaBizLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200">
      {/* Navigation */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-gray-800 shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <a href="/" className="flex items-center">
                <span className="text-blue-400 font-bold text-2xl">Nexa</span>
                <span className="text-gray-200 font-bold text-2xl">Biz</span>
              </a>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#features" 
              className="text-gray-300 hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#how-it-works" 
              className="text-gray-300 hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              How It Works
            </motion.a>
            <motion.a 
              href="#testimonials" 
              className="text-gray-300 hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Testimonials
            </motion.a>
            
            <motion.a 
              href="/admin" 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request a demo
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gray-800 w-full shadow-lg"
            >
              <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
                <a 
                  href="#features" 
                  className="text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
                <a 
                  href="#testimonials" 
                  className="text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a 
                  href="/login" 
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register Now
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section - Made more responsive */}
      <section className="relative min-h-screen flex items-center pt-16 pb-12 md:py-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0"></div>
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-20 right-10 w-64 h-64 bg-blue-900 rounded-full opacity-10 z-0"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div 
          className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-800 rounded-full opacity-10 z-0"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Simplify Business. 
                <span className="text-blue-400"> Empower Growth.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                NexaBiz helps you manage CRM, sales, HR, finance, and inventory – all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.a 
                  href="/register" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register Now <ChevronRight size={18} className="ml-1" />
                </motion.a>
                <motion.a 
                  href="/login" 
                  className="bg-gray-800 text-blue-400 border border-blue-400 px-8 py-3 rounded-lg font-medium flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 w-full max-w-lg mx-auto lg:max-w-none"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                {/* Dashboard Preview Image */}
                <div className="bg-gray-800 p-2 rounded-2xl shadow-2xl">
                  <div className="bg-gray-700 rounded-xl p-2">
                    <div className="flex items-center mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="mx-auto bg-gray-800 rounded-md px-4 py-1 text-xs text-gray-400">
                        NexaBiz Dashboard
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg shadow-sm p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        <div className="bg-blue-900 p-3 rounded-lg">
                          <div className="w-full h-2 bg-blue-700 rounded-full mb-2"></div>
                          <div className="w-2/3 h-2 bg-blue-700 rounded-full"></div>
                        </div>
                        <div className="bg-green-900 p-3 rounded-lg">
                          <div className="w-full h-2 bg-green-700 rounded-full mb-2"></div>
                          <div className="w-2/3 h-2 bg-green-700 rounded-full"></div>
                        </div>
                        <div className="bg-purple-900 p-3 rounded-lg hidden md:block">
                          <div className="w-full h-2 bg-purple-700 rounded-full mb-2"></div>
                          <div className="w-2/3 h-2 bg-purple-700 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        <div className="w-1/2 h-24 bg-gray-700 rounded-lg mr-3 p-3">
                          <div className="w-full h-3 bg-gray-600 rounded-full mb-2"></div>
                          <div className="w-5/6 h-3 bg-gray-600 rounded-full mb-2"></div>
                          <div className="w-2/3 h-3 bg-gray-600 rounded-full"></div>
                        </div>
                        <div className="w-1/2 h-24 bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between mb-1">
                            <div className="w-1/4 h-2 bg-gray-600 rounded-full"></div>
                            <div className="w-1/4 h-2 bg-gray-600 rounded-full"></div>
                          </div>
                          <div className="h-14 bg-blue-900 rounded-md mt-2"></div>
                        </div>
                      </div>
                      <div className="h-32 bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between mb-2">
                          <div className="w-1/4 h-2 bg-gray-600 rounded-full"></div>
                          <div className="w-1/6 h-2 bg-gray-600 rounded-full"></div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <div className="w-1/5 h-16 bg-blue-800 rounded-md"></div>
                          <div className="w-1/5 h-12 bg-blue-700 rounded-md self-end"></div>
                          <div className="w-1/5 h-20 bg-blue-600 rounded-md self-end"></div>
                          <div className="w-1/5 h-16 bg-blue-500 rounded-md self-end"></div>
                          <div className="w-1/5 h-10 bg-blue-400 rounded-md self-end"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated Elements */}
                <motion.div 
                  className="absolute -top-8 -right-8 bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  CRM
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-green-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                >
                  HR
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              All-in-One <span className="text-blue-400">Business Solution</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              NexaBiz brings all essential business tools into one integrated platform, streamlining your operations.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "CRM & Customer Support",
                description: "Manage leads, track interactions, and provide superior customer support in one place.",
                color: "blue"
              },
              {
                title: "Sales Tracking",
                description: "Monitor deals, track performance, and optimize your sales pipeline for maximum revenue.",
                color: "indigo"
              },
              {
                title: "Human Resources",
                description: "Streamline HR processes, from recruitment to performance management and payroll.",
                color: "purple"
              },
              {
                title: "Finance Management",
                description: "Track expenses, manage invoices, and generate financial reports with ease.",
                color: "green"
              },
              {
                title: "Inventory Control",
                description: "Maintain optimal stock levels, track product movement, and prevent stockouts.",
                color: "yellow"
              },
              {
                title: "Smart Reporting",
                description: "Access real-time data analytics and custom reports to make informed decisions.",
                color: "red"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-700 rounded-xl p-6 shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-900 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-md bg-blue-500"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-100">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              How <span className="text-blue-400">NexaBiz</span> Works
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Get started with NexaBiz in three simple steps
            </motion.p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-12 md:space-y-0">
            {[
              {
                step: 1,
                title: "Register your company",
                description: "Create your account and set up your company profile in minutes.",
                delay: 0
              },
              {
                step: 2,
                title: "Set up your modules",
                description: "Choose and configure the modules that your business needs.",
                delay: 0.2
              },
              {
                step: 3,
                title: "Manage everything from one dashboard",
                description: "Access all your business operations from a unified dashboard.",
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center max-w-xs text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: step.delay }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-full bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-400 mb-6"
                  whileHover={{ scale: 1.1, backgroundColor: "#2563EB", color: "#FFFFFF" }}
                >
                  {step.step}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-gray-100">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>

                {index < 2 && (
                  <div className="hidden md:block h-0.5 w-24 bg-blue-700 absolute left-1/2 top-10 transform translate-x-8">
                    <div className="h-2 w-2 rounded-full bg-blue-500 absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              What Our <span className="text-blue-400">Clients Say</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Hear from businesses who have transformed with NexaBiz
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO, TechStart Inc.",
                quote: "NexaBiz transformed how we manage our business. We've increased efficiency by 40% and our team loves having everything in one place."
              },
              {
                name: "Michael Chen",
                role: "Operations Director, Global Logistics",
                quote: "The inventory management module has eliminated stockouts and reduced our carrying costs significantly. The ROI was immediate."
              },
              {
                name: "Elena Rodriguez",
                role: "HR Manager, CreativeVision",
                quote: "Managing our growing team became so much easier with NexaBiz. The HR tools are intuitive and save us countless hours each month."
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-700 p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-200">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Ready to streamline your business?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 text-blue-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Join thousands of businesses that trust NexaBiz for their daily operations.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.a 
              href="/register" 
              className="bg-white text-blue-800 px-8 py-3 rounded-lg font-medium shadow-lg inline-flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Register Now <ChevronRight size={18} className="ml-1" />
            </motion.a>
            <motion.a 
              href="/login" 
              className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-blue-400 font-bold text-xl">Nexa</span>
                <span className="text-white font-bold text-xl">Biz</span>
              </div>
              <p className="text-gray-400 mb-4">
                The all-in-one business solution to manage CRM, sales, HR, finance, and inventory.
              </p>
              <div className="flex space-x-3">
                <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="https://facebook.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-white text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-blue-400 transition-colors">Testimonials</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="text-white text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2">
                <li><a href="/help-center" className="text-gray-400 hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</a></li>
                <li><a href="/documentation" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="/status" className="text-gray-400 hover:text-blue-400 transition-colors">System Status</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-blue-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-white text-lg font-semibold mb-4">Stay Updated</h5>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
              <form className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} NexaBiz. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm text-gray-400">
                <a href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                <a href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                <a href="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}