import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../redux/slices/authSlice";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", role: "student",
    program: "", department: "", batchYear: "", gender: "prefer_not_to_say",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === "fulfilled") {
      if (res.payload?.token) {
        toast.success("Account created");
        navigate("/");
      } else {
        toast.success(res.payload?.message || "Registration submitted for approval");
        navigate("/login");
      }
    }
    else toast.error(res.payload || "Registration failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-500 mb-1">Create your account</h1>
        <p className="text-slate-500 mb-6">Join the alumni network</p>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Program (BSc/BCA/BA...)" required value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} />
          <input className="input" placeholder="Department" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <input className="input" type="date" required value={form.batchYear ? `${form.batchYear}-01-01` : ""} onChange={(e) => setForm({ ...form, batchYear: e.target.value ? new Date(e.target.value).getFullYear().toString() : "" })} />
          <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="prefer_not_to_say">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input className="input" type="password" placeholder="Password (min 6 chars)" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
            <option value="faculty">Faculty</option>
          </select>
          <p className="text-xs text-slate-500">Note: the very first user to register becomes Admin.</p>
          <button className="btn-primary w-full">Create Account</button>
        </form>
        <p className="text-sm text-center mt-4">Have an account? <Link to="/login" className="text-brand-500">Sign in</Link></p>
      </div>
    </div>
  );
}
