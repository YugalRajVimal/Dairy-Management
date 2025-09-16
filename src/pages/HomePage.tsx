import { Link } from "react-router";
import Button from "../components/ui/button/Button";

const HomePage = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-200 px-6 relative">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">Dairy Management</span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
          Manage assets, track reports, and streamline operations with secure
          role-based access. Please select your login role to continue.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/admin/signin">
            <Button className="w-full md:w-auto px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition">
              Admin Login
            </Button>
          </Link>
          <Link to="/sub-admin/signin">
            <Button className="w-full md:w-auto px-6 py-3 text-lg bg-gray-800 hover:bg-gray-900 text-white rounded-xl shadow-lg transition">
              Sub Admin Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Dairy Management System
      </footer>
    </div>
  );
};

export default HomePage;
