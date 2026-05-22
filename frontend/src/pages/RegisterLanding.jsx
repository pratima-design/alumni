import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const roles = [
  { param: "faculty", label: "Faculty", icon: "🎓", desc: "Register as a faculty member" },
  { param: "alumni",  label: "Alumni",  icon: "🏛️", desc: "Register as an alumnus/alumna" },
  { param: "student", label: "Student", icon: "📚", desc: "Register as a current student" },
];

export default function RegisterLanding() {
  const { user } = useSelector((s) => s.auth);
  
  if (user) return <Navigate to="/feed" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-500 mb-1">Create your account</h1>
        <p className="text-slate-500 mb-6">Join AlumniConnect — choose your role</p>

        <div className="grid grid-cols-1 gap-3">
          {roles.map(({ param, label, icon, desc }) => (
            <Link
              key={param}
              to={`/register/${param}`}
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

        <p className="text-xs text-slate-400 text-center mt-4">
          Admin accounts are provisioned separately.
        </p>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
