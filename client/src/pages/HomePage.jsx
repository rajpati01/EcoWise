import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-green-50 text-gray-800">
      <Header />

       <section className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-center" style={{ backgroundImage: `url('/your-image.jpg')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 max-w-4xl px-4 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Sustainable Future Through <span className="text-green-400">Smart Waste Management</span>
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Join our community, classify waste using AI, earn rewards, and participate in local environmental campaigns.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/classify" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
            Classify Waste
          </a>
          <a href="/community" className="bg-white text-gray-900 px-6 py-3 rounded hover:bg-gray-200 transition">
            Join Community
          </a>
        </div>
      </div>
    </section>

      <Footer />
    </div>
  );
}

export default HomePage;