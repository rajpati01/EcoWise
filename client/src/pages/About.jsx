
import React from "react";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-6">About EcoWise</h1>
      <p className="text-gray-700 text-lg mb-4">
        EcoWise is an AI-powered platform designed to promote sustainable waste management practices through technology, education, and community engagement.
      </p>
      <p className="text-gray-700 text-lg mb-4">
        Our platform features an intelligent waste classification system powered by TensorFlow.js, helping users properly sort waste in real time. Users earn EcoPoints for their eco-friendly actions, climb the leaderboard, and participate in local campaigns to make a tangible impact.
      </p>
      <p className="text-gray-700 text-lg mb-4">
        Whether you're a student, a professional, or a sustainability enthusiast, EcoWise empowers you with tools to contribute to a cleaner and greener planet.
      </p>
    </div>
  );
};

export default About;
