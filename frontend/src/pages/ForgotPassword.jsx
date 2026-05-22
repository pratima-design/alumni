import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { forgotPassword } from "../redux/slices/authSlice";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(forgotPassword({ email }));
    if (res.meta.requestStatus === "fulfilled") toast.success(res.payload.message);
    else toast.error(res.payload || "Unable to process request");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-500 mb-1">Forgot Password</h1>
        <p className="text-slate-500 mb-6">Enter your email to get a reset link</p>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn-primary w-full">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}
