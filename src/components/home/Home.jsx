import { useNavigate } from "react-router-dom";

import { TaskManagerContext } from "@/context";
import { useContext } from "react";
import Header from "../header/Header";

const Home = () => {
  const { user } = useContext(TaskManagerContext);

  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/tasks");
    } else {
      navigate("/auth?mode=register");
    }
  };

  const handleSignIn = () => {
    navigate("/auth?mode=login");
  };

  return (
    <section>
      {/* <Header /> */}
      <div className="min-h-screen bg-gray-50 text-black pt-20 -mt-20">
        {" "}
        {/* Changed mt-32 to pt-20 */}
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-32 -mt-5 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to TaskNest
            </h1>
            <p className="text-[16px] sm:text-[18px] md:text-xl mb-8 max-w-2xl mx-auto">
              Unleash your productivity with TaskNest, the ultimate app for
              capturing notes and managing tasks. Organize your ideas, plan your
              day, and achieve your goals effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-5  justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </button>
              {!user && (
                <button
                  onClick={handleSignIn}
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-12 px-4" id="about">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              What Makes TaskNest Special?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-blue-500 text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Capture Notes
                </h3>
                <p className="text-gray-600">
                  Quickly jot down ideas and keep them organized for easy
                  access.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-blue-500 text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Manage Tasks
                </h3>
                <p className="text-gray-600">
                  Track tasks with priorities and statuses to stay on top of
                  your goals.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-blue-500 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Collaborate
                </h3>
                <p className="text-gray-600">
                  Share notes and tasks with your team for seamless teamwork.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-12 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Start Organizing Today!</h2>
            <p className="text-lg mb-6">
              Join TaskNest and take control of your tasks and notes.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Join Now
            </button>
          </div>
        </section>
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 text-center">
          <p>© 2025 TaskNest. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/about" className="text-gray-400 hover:text-white">
              About
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white">
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Home;
