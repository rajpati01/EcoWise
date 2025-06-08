import React from "react";
import { Link } from "react-router-dom";
import Blog from "../pages/Blog";
import About from "../pages/About";

 const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-700">
          EcoWise
        </Link>
        <nav className="flex gap-6 font-medium">
        <Link to="/" className="text-green-600">Home</Link>
        <Link to="/about" className="text-gray-700 hover:text-green-600">About</Link>
        <Link to="/classify" className="text-gray-700 hover:text-green-600">Waste Classification</Link>
        <Link to="/campaigns" className="text-gray-700 hover:text-green-600">Campaigns</Link>
        <Link to="/leaderboard" className="text-gray-700 hover:text-green-600">Leaderboard</Link>
        <Link to="/blog" className="text-gray-700 hover:text-green-600">Blog</Link>
      </nav>

        <div className="flex gap-2">
          <Link to="/login" className="text-gray-700 hover:text-green-700">Login</Link>
          <Link to="/get-started" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;