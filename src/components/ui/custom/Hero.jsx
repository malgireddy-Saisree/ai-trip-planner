import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen bg-cover bg-center bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500"
      style={{
        backgroundImage: 'url(image.png)', // Assuming the image is stored in the 'public/images' folder
      }}
    >
      <div className="bg-opacity-70 bg-black p-12 rounded-lg text-white text-center max-w-4xl mx-auto mt-20">
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
          "Discover the World, One Perfect Plan at a Time"
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8">
          Plan your dream journey effortlessly with our AI-powered trip planner.
          Whether you're seeking adventure or relaxation, we'll craft the perfect
          itinerary tailored just for you.
        </p>
        <Link to="/create-trip">
          <button className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white py-3 px-8 rounded-xl text-xl font-semibold transition duration-300 ease-in-out hover:bg-yellow-500 hover:scale-105">
            Get Started
          </button>
        </Link>
      </div>
      
      {/* Add a picture at the bottom */}
      <div className="w-full mt-12">
        <img
          
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default Hero;
