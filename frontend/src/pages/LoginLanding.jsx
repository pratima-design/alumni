import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const roles = [
  { param: "admin",   label: "Admin",   icon: "🛡️", desc: "Manage the platform" },
  { param: "faculty", label: "Faculty", icon: "🎓", desc: "Faculty members" },
  { param: "alumni",  label: "Alumni",  icon: "🏛️", desc: "Graduated students" },
  { param: "student", label: "Student", icon: "📚", desc: "Current students" },
];

export default function LoginLanding() {
  const { user } = useSelector((s) => s.auth);
  
  if (user) return <Navigate to="/feed" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-500 mb-1">Welcome back</h1>
        <p className="text-slate-500 mb-6">Sign in — choose your account type</p>

        <div className="grid grid-cols-1 gap-3">
          {roles.map(({ param, label, icon, desc }) => (
            <Link
              key={param}
              to={`/login/${param}`}
              className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3 hover:border-brand-500 hover:bg-brand-50 transition-colors"
            >
              <span className="text-2xl">{icon}</span>
              <div className="text-left">
                <p className="font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <span className="ml-auto text-slate-400">→</span>
            </Link>
          ))}
        </div>

        <p className="text-sm text-center mt-5">
          New here?{" "}
          <Link to="/register" className="text-brand-500 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
