import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../redux/slices/authSlice";

const DEPARTMENTS = [
  "Computer Science", "Information Technology", "Mathematics",
  "Physics", "Chemistry", "Biology", "English", "Education",
  "Physical Education", "History", "Political Science",
  "Economics", "Commerce", "Other",
];

const STUDENT_PROGRAMS = ["BA", "BSC", "BCA", "ITEP", "BPES", "MA", "MSC", "PHD"];

// Generate years from current year down to 1990
const BATCH_YEARS = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, i) => new Date().getFullYear() - i
);

const ROLE_META = {
  faculty: { label: "Faculty", icon: "🎓" },
  alumni:  { label: "Alumni",  icon: "🏛️" },
  student: { label: "Student", icon: "📚" },
};

export default function RegisterRole() {
  const { role } = useParams();
  const backendRole = ["faculty", "alumni", "student"].includes(role) ? role : "student";
  const meta = ROLE_META[backendRole] || ROLE_META.student;

  const initialForm = useMemo(() => ({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    role: backendRole, department: "",
    program: "", batchYear: "", rollNo: "", gender: "prefer_not_to_say",
  }), [backendRole]);

  const [form, setForm] = useState(initialForm);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      name: form.name, email: form.email, phone: form.phone,
      password: form.password, role: backendRole, department: form.department,
    };

    if (backendRole === "student") {
      payload.program  = form.program;
      payload.rollNo   = form.rollNo;
      payload.gender   = form.gender;
      if (form.batchYear) payload.batchYear = form.batchYear;
    }

    const res = await dispatch(register(payload));
    if (res.meta.requestStatus !== "fulfilled") {
      toast.error(res.payload || "Registration failed");
      return;
    }

    if (res.payload?.token) {
      toast.success("Account created! Welcome.");
      navigate("/feed");
    } else {
      toast.success(res.payload?.message || "Registration submitted — awaiting admin approval.");
      navigate(`/login/${role}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card p-8 w-full max-w-md">
        <Link to="/register" className="text-sm text-slate-400 hover:text-brand-500 mb-4 inline-block">← Back</Link>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{meta.icon}</span>
          <h1 className="text-2xl font-bold text-brand-500">{meta.label} Registration</h1>
        </div>
        <p className="text-slate-500 mb-6">Fill in your details to create an account</p>

        <form onSubmit={submit} className="space-y-4">
          {/* Common fields */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
            <input className="input" placeholder="John Doe" required value={form.name} onChange={set("name")} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <input className="input" type="email" placeholder="john@example.com" required value={form.email} onChange={set("email")} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Phone</label>
            <input className="input" type="tel" placeholder="+91 98765 43210" required value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Department</label>
            <select className="input" required value={form.department} onChange={set("department")}>
              <option value="">— Select Department —</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Student-only fields */}
          {backendRole === "student" && (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Roll Number</label>
                <input
                  className="input" placeholder="e.g. 23BC023" required
                  value={form.rollNo} onChange={set("rollNo")}
                />
                <p className="text-xs text-slate-400 mt-1">Format: YY + Program code + serial (e.g. 22BA023, 23BCA012)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Program</label>
                <select className="input" required value={form.program} onChange={set("program")}>
                  <option value="">— Select Program —</option>
                  {STUDENT_PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Batch Year <span className="text-slate-400 text-xs">(optional)</span>
                </label>
                <select className="input" value={form.batchYear} onChange={set("batchYear")}>
                  <option value="">— Select Year —</option>
                  {BATCH_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Gender</label>
                <select className="input" value={form.gender} onChange={set("gender")}>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
            <input className="input" type="password" placeholder="Min 6 characters" required minLength={6} value={form.password} onChange={set("password")} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Confirm Password</label>
            <input className="input" type="password" placeholder="Re-enter password" required minLength={6} value={form.confirmPassword} onChange={set("confirmPassword")} />
          </div>

          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
            ℹ️ Your account will require admin approval before you can log in.
          </p>
          <button className="btn-primary w-full">Create {meta.label} Account</button>
        </form>

        <p className="text-sm text-center mt-4">
          Have an account?{" "}
          <Link to={`/login/${role}`} className="text-brand-500 font-medium">Sign in as {meta.label}</Link>
        </p>
      </div>
    </div>
  );
}
