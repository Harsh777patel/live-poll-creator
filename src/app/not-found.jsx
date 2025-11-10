import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-violet-300 text-white flex justify-center items-center px-4">
      <div className="text-center space-y-6">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-8">
          Page does not exist
        </p>

        <img
          src="/404image.avif"
          alt="404 Not Found"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-4 rounded-xl shadow-lg"
        />

        <a href="/">
          <button className="bg-violet-800 mt-4 text-white font-bold px-6 py-3 rounded-xl shadow-xl hover:bg-violet-700 transition">
            Back to Homepage
          </button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
