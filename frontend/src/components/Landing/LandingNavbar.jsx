import { Link } from "react-router-dom";
import { useState } from "react";

export default function LandingNavbar() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Banner */}
      {/* {showAnnouncement && (
        <div className="bg-teal-700 text-white py-2 px-4 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold">NEW</span>
              <span className="text-sm">AlumniConnect Update 2025 - Discover new innovations and strategies to elevate your network.</span>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="text-white hover:text-white/80 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )} */}

      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AC</span>
                </div>
                <span className="text-lg font-bold text-slate-900">AlumniConnect</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-teal-600 transition-colors text-sm font-medium">About</a>
              <a href="#features" className="text-slate-600 hover:text-teal-600 transition-colors text-sm font-medium">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-teal-600 transition-colors text-sm font-medium">Pricing</a>
              <a href="#company" className="text-slate-600 hover:text-teal-600 transition-colors text-sm font-medium">Company</a>
            </nav>

            {/* Auth Links */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                Log In
              </Link>
              <Link to="/register/user" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
