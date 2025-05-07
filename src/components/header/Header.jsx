import { TaskManagerContext } from "@/context";
import { Menu, X } from "lucide-react"; // Icons for hamburger menu
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useContext(TaskManagerContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    // <nav className="bg-blue-600 text-white p-4 flex justify-between">
    //   <div>
    //     <h1 className="text-lg font-bold">Task Manager</h1>
    //   </div>
    //   {user ? (
    //     <div className="flex items-center gap-4">
    //       <span>Welcome, {user.name}</span>
    //       <button
    //         onClick={() => logout()}
    //         className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   ) : (
    //     <div className="flex items-center gap-4">
    //       <button
    //         onClick={() => navigate("/auth?mode=login")}
    //         className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
    //       >
    //         Login
    //       </button>
    //     </div>
    //   )}
    // </nav>
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white fixed top-0 w-full z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h1 className="text-xl font-bold">TaskNest</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/" className="hover:text-blue-200 transition">
            Home
          </a>
          {user && (
            <>
              <a href="/tasks" className="hover:text-blue-200 transition">
                Tasks
              </a>
              <a href="/taskboard" className="hover:text-blue-200 transition">
                Task board
              </a>
            </>
          )}
          <a href="/#about" className="hover:text-blue-200 transition">
            About
          </a>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/auth?mode=login")}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/auth?mode=register")}
                className="border border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 text-white px-4 py-2">
          <a
            href="/"
            className="block py-2 hover:text-blue-200 transition"
            onClick={toggleMenu}
          >
            Home
          </a>
          {user && (
            <a
              href="/tasks"
              className="block py-2 hover:text-blue-200 transition"
              onClick={toggleMenu}
            >
              Tasks
            </a>
          )}
          <a
            href="/about"
            className="block py-2 hover:text-blue-200 transition"
            onClick={toggleMenu}
          >
            About
          </a>
          {user ? (
            <div className="flex flex-col space-y-2 mt-2">
              <span className="py-2 text-sm">Welcome, {user.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-left"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 mt-2">
              <button
                onClick={() => {
                  navigate("/auth?mode=login");
                  toggleMenu();
                }}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-left"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/auth?mode=register");
                  toggleMenu();
                }}
                className="border border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-left"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
