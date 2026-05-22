import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function AdminPanel() {
  const { user } = useSelector((s) => s.auth);
  const [users, setUsers] = useState([]);

  // Faculty no longer has user management access — redirect them away
  if (user?.role === "faculty") {
    return (
      <div className="card p-8 text-center text-slate-500">
        <p className="text-lg font-medium mb-2">Access Restricted</p>
        <p className="text-sm">User management is only available to administrators.</p>
      </div>
    );
  }

  const load = () => api.get("/users").then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const setRole = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    toast.success("Role updated"); load();
  };
  const approve = async (id) => {
    await api.put(`/users/${id}/approve`);
    toast.success("User approved"); load();
  };
  const del = async (id) => {
    if (!confirm("Delete user?")) return;
    await api.delete(`/users/${id}`);
    toast.success("User deleted"); load();
  };

  return (
    <div className="card overflow-hidden">
      <h1 className="p-4 font-bold border-b text-lg">Admin Panel — Users</h1>
      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-semibold text-slate-600">Name</th>
              <th className="text-left p-3 font-semibold text-slate-600">Email</th>
              <th className="text-left p-3 font-semibold text-slate-600">Role</th>
              <th className="text-left p-3 font-semibold text-slate-600">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.filter((u) => u.role !== "admin").map((u) => (
              <tr key={u._id} className="border-t hover:bg-slate-50 transition-colors">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-slate-600">{u.email}</td>
                <td className="p-3">
                  <select
                    className="input py-1 text-xs w-auto"
                    value={u.role}
                    onChange={(e) => setRole(u._id, e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${u.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {u.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  {!u.isApproved && (
                    <button onClick={() => approve(u._id)} className="text-green-600 hover:underline mr-3 text-xs font-medium">
                      Approve
                    </button>
                  )}
                  <button onClick={() => del(u._id)} className="text-red-500 hover:underline text-xs font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.filter((u) => u.role !== "admin").length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400 text-sm">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
