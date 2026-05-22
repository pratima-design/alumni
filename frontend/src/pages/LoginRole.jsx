import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { login, logout } from "../redux/slices/authSlice";

// URL param → backend role
const PARAM_TO_ROLE = {
  admin:   "admin",
  faculty: "faculty",
  alumni:  "alumni",
  student: "student",
};

const ROLE_META = {
  admin:   { label: "Admin",   icon: "🛡️", showRegister: false },
  faculty: { label: "Faculty", icon: "🎓", showRegister: true },
  alumni:  { label: "Alumni",  icon: "🏛️", showRegister: true },
  student: { label: "Student", icon: "📚", showRegister: true },
};

export default function LoginRole() {
  const { role } = useParams();
  const backendRole = PARAM_TO_ROLE[role] || "student";
  const meta = ROLE_META[backendRole] || ROLE_META.student;

  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate("/feed", { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login({ ...form, role: backendRole }));
    if (res.meta.requestStatus !== "fulfilled") {
      toast.error(res.payload || "Login failed");
      return;
    }

    const me = res.payload;
    // Mismatch guard
    if (me?.role !== backendRole) {
      toast.error(
        `This account is registered as '${me?.role}'. Please use the correct login page.`
      );
      dispatch(logout());
      navigate(`/login/${me?.role || "student"}`);
      return;
    }

    toast.success(`Welcome back, ${me.name}!`);
    navigate("/feed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 w-full max-w-md">
        {/* Back */}
        <Link to="/login" className="text-sm text-slate-400 hover:text-brand-500 mb-4 inline-block">
          ← Back
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{meta.icon}</span>
          <h1 className="text-2xl font-bold text-brand-500">{meta.label} Sign In</h1>
        </div>
        <p className="text-slate-500 mb-6">Enter your credentials to continue</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <input
              className="input"
              type="email"
              placeholder="your@email.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button className="btn-primary w-full">Sign In</button>
        </form>

        <p className="text-sm text-center mt-3">
          <Link to="/forgot-password" className="text-brand-500">
            Forgot password?
          </Link>
        </p>

        {meta.showRegister && (
          <p className="text-sm text-center mt-4">
            No account?{" "}
            <Link to={`/register/${role}`} className="text-brand-500 font-medium">
              Register as {meta.label}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
