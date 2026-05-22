import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../redux/slices/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  if (user) navigate("/");

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === "fulfilled") { toast.success("Welcome back"); navigate("/"); }
    else toast.error(res.payload || "Login failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-500 mb-1">AlumniConnect</h1>
        <p className="text-slate-500 mb-6">Sign in to your account</p>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" type="email" placeholder="Email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full">Sign In</button>
        </form>
        <p className="text-sm text-center mt-3"><Link to="/forgot-password" className="text-brand-500">Forgot password?</Link></p>
        <p className="text-sm text-center mt-4">No account? <Link to="/register" className="text-brand-500">Register</Link></p>
      </div>
    </div>
  );
}
