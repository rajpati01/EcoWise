import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, User, LogIn, Camera, MapPin, BookOpen, Trophy, HomeIcon, Info  } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icons: <HomeIcon size={16} /> },
    { name: 'About', path: '/about', icons: <Info size={16} /> },
    { name: 'Waste Classification', path: '/classify', icons: <Camera size={16} /> },
    { name: 'Campaigns', path: '/campaigns', icons: <MapPin size={16} /> },
    { name: 'Leaderboard', path: '/leaderboard', icons: <Trophy size={16} /> },
    { name: 'Blogs', path: '/blogs', icons: <BookOpen size={16} /> },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container justify-between mx-auto px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-display font-bold text-gray-800">EcoWise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  
                  <Link
                    to={link.path}
                    className={`font-medium transition-colors hover:text-primary-500 flex ${
                      location.pathname === link.path
                        ? 'text-primary-500'
                        : scrolled
                        ? 'text-gray-700'
                        : 'text-gray-800'
                    }`}
                  >
                    {link.icons && <span className='flex items-center pr-2'>{link.icons}</span>}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className={`flex items-center space-x-1 font-medium ${
                  scrolled ? 'text-gray-700' : 'text-gray-800'
                } hover:text-primary-500 transition-colors`}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-md bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-500 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <ul className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-2 font-medium transition-colors hover:bg-gray-50 hover:text-primary-500 ${
                      location.pathname === link.path ? 'text-primary-500' : 'text-gray-700'
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 px-4 pt-4 flex flex-col space-y-3 border-t border-gray-100">
              <Link
                to="/login"
                className="flex items-center space-x-2 font-medium text-gray-700 hover:text-primary-500 transition-colors"
                onClick={toggleMenu}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-primary-500 text-white font-medium text-center hover:bg-primary-600 transition-colors"
                onClick={toggleMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

