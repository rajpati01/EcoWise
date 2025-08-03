import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Leaf,
  Menu,
  X,
  User,
  LogIn,
  Camera,
  MapPin,
  BookOpen,
  Trophy,
  HomeIcon,
  Info,
} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

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

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icons: <HomeIcon size={16} /> },
    { name: "About", path: "/about", icons: <Info size={16} /> },
    ...(isAuthenticated
      ? [
          {
            name: "Waste Classification",
            path: "/classify",
            icons: <Camera size={16} />,
          },
          {
            name: "Campaigns",
            path: "/campaigns",
            icons: <MapPin size={16} />,
          },
          {
            name: "Leaderboard",
            path: "/leaderboard",
            icons: <Trophy size={16} />,
          },
          { name: "Blogs", path: "/blogs", icons: <BookOpen size={16} /> },
        ]
      : []),
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container justify-between mx-auto px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-display font-bold text-gray-800">
              EcoWise
            </span>
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
                        ? "text-primary-500"
                        : scrolled
                        ? "text-gray-700"
                        : "text-gray-800"
                    }`}
                  >
                    {link.icons && (
                      <span className="flex items-center pr-2">
                        {link.icons}
                      </span>
                    )}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Section */}
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                    >
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{user?.name}</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        {user?.role === "admin" && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className={`flex items-center space-x-1 font-medium ${
                        scrolled ? "text-gray-700" : "text-gray-800"
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
                )}
              </>
            )}
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
                      location.pathname === link.path
                        ? "text-primary-500"
                        : "text-gray-700"
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {user?.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        to={`/profile/${user?._id}`}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                          onClick={() => setIsOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
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
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
