import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../redux/slices/authSlice";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const token = searchParams.get("token");
    if (!token) return toast.error("Missing reset token");
    const res = await dispatch(resetPassword({ token, password }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Password reset successful");
      navigate("/login");
    } else toast.error(res.payload || "Could not reset password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-500 mb-1">Reset Password</h1>
        <p className="text-slate-500 mb-6">Set a new password for your account</p>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" type="password" required minLength={6} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-primary w-full">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
