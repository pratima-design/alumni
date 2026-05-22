import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-lg font-bold text-white">AlumniConnect</span>
            </div>
            <p className="text-sm">Connecting alumni, students, and professionals worldwide.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Features</Link></li>
              <li><Link to="/" className="hover:text-white transition">Pricing</Link></li>
              <li><Link to="/" className="hover:text-white transition">Security</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">About</Link></li>
              <li><Link to="/" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Privacy</Link></li>
              <li><Link to="/" className="hover:text-white transition">Terms</Link></li>
              <li><Link to="/" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© 2026 AlumniConnect. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white transition">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-white transition">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-white transition">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
