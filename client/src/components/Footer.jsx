import React from "react";

const Footer = () => {
  return (
     <div className="flex flex-col min-h-screen">
    <footer className=" bg-gray-900 text-gray-300 pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">EcoWise</h2>
          <p className="text-sm">
            Promoting sustainable waste management through education, technology, and community action.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/classify">Waste Classification</a></li>
            <li><a href="/campaigns">Campaigns</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-2">Our Services</h3>
          <ul className="space-y-1 text-sm">
            <li>AI Waste Classification</li>
            <li>EcoPoints Rewards</li>
            <li>Community Leaderboard</li>
            <li>Disposal Centers</li>
            <li>Educational Resources</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-2">Contact Us</h3>
          <ul className="text-sm space-y-1">
            <li>📍 123 Green Street, Kathmandu, Nepal</li>
            <li>📞 +977 9706853211</li>
            <li>✉️ contact@ecowise.com</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4">
        &copy; 2025 EcoWise. All rights reserved.
      </div>
    </footer>
    </div>
  );
}

export default Footer;