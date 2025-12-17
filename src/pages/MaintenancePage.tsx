import React from "react";

const MaintenancePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md px-8 py-10 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <svg
          className="mx-auto mb-6 h-20 w-20 text-yellow-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 48 48"
        >
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M24 14v10m0 6h.01"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          We're Under Maintenance
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Our software is currently undergoing scheduled maintenance to serve you better.<br />
          Please check back later. Thank you for your patience!
        </p>
        <div className="flex items-center justify-center mb-6">
          <span className="animate-spin inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full"></span>
        </div>
        <div className="flex items-center justify-center">
          <a
            href="/"
            className="inline-block px-6 py-2 bg-yellow-400 text-white font-semibold rounded-md shadow hover:bg-yellow-500 transition-colors duration-150"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
