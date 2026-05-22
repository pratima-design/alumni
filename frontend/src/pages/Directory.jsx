import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();
const BATCH_YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "", role: "", batchYear: "", department: "", location: "", designation: "",
  });

  const load = async () => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    const { data } = await api.get(`/users?${params}`);
    setUsers(data);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <div>
      <div className="card p-4 mb-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Search Name / Email</label>
            <input className="input" placeholder="e.g. John Doe" value={filters.search} onChange={set("search")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Role</label>
            <select className="input" value={filters.role} onChange={set("role")}>
              <option value="">All roles</option>
              <option value="faculty">Faculty</option>
              <option value="alumni">Alumni</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Batch Year</label>
            <select className="input" value={filters.batchYear} onChange={set("batchYear")}>
              <option value="">All years</option>
              {BATCH_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Location</label>
            <input className="input" placeholder="e.g. Mumbai" value={filters.location} onChange={set("location")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Designation</label>
            <input className="input" placeholder="e.g. Professor" value={filters.designation} onChange={set("designation")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Department</label>
            <input className="input" placeholder="e.g. Computer Science" value={filters.department} onChange={set("department")} />
          </div>
        </div>
        <button className="btn-primary w-full md:w-40" onClick={load}>Search</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u) => (
          <Link to={`/profile/${u._id}`} key={u._id} className="card p-4 flex items-center gap-3 hover:shadow-md">
            {u.photo ? <img src={u.photo} className="w-14 h-14 rounded-full object-cover" alt="" /> :
              <div className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-bold">{u.name[0]}</div>}
            <div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-slate-500">{u.designation || u.role} {u.batchYear && `• ${u.batchYear}`}</div>
              <div className="text-xs text-slate-400">{u.department}</div>
            </div>
          </Link>
        ))}
        {users.length === 0 && <div className="col-span-2 card p-8 text-center text-slate-500">No users found.</div>}
      </div>
    </div>
  );
}
