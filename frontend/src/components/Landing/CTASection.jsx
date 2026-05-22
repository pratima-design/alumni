import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to Join Our Community?
        </h2>
        <p className="text-xl opacity-90">
          Start building meaningful connections and advance your career today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            to="/register/user" 
            className="px-8 py-3 bg-white text-teal-600 font-bold rounded-lg hover:bg-slate-100 transition-colors text-center"
          >
            Sign Up Now
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-center"
          >
            Already a Member?
          </Link>
        </div>
      </div>
    </section>
  );
}
