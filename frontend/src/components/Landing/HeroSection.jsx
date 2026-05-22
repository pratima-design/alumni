import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] bg-white flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
              Seamless Integration
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Connect with Your Alumni Community
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              Join thousands of students, alumni, and faculty members. Share experiences, find mentors, and create lasting professional relationships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/register/user" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded font-semibold transition-colors text-center">
                Get Started
              </Link>
              <button className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded font-semibold transition-colors">
                Learn More
              </button>
            </div>

            {/* Rating and Review */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <span className="font-semibold text-slate-700">4.8</span>
              <span className="text-slate-600 text-sm">From 500+ members</span>
            </div>
          </div>

          {/* Right Visual - Image */}
          <div className="relative hidden md:block over">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://i.pinimg.com/webp/736x/ce/f3/51/cef351bac2b39f74c50eea8e82064a62.webp" 
                alt="AlumniConnect dashboard" 
                className="w-full h-68 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
