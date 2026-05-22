import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useSelector((s) => s.auth);
  const [user, setUser] = useState(null);
  useEffect(() => { api.get(`/users/${id}`).then((r) => setUser(r.data)); }, [id]);
  if (!user) return <div className="card p-6">Loading...</div>;
  return (
    <div>
      <div className="card p-6">
        <div className="flex items-start gap-6">
          {user.photo ? <img src={user.photo} className="w-28 h-28 rounded-full object-cover" alt="" /> :
            <div className="w-28 h-28 rounded-full bg-brand-500 text-white flex items-center justify-center text-4xl font-bold">{user.name[0]}</div>}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-slate-600">{user.designation || user.role}</p>
            <p className="text-sm text-slate-500 mt-1">
             
              {user.department && <>🎓 {user.department}</>}
               {user.batchYear && <> • Batch {user.batchYear}</>}
              
              {user.location && <> • 📍 {user.location}</>}
            </p>
            {currentUser?._id !== user._id && (
              <div className="mt-3 flex gap-2">
                <Link to={`/messages/${user._id}`} className="btn-primary">Message</Link>
              </div>
            )}
          </div>
        </div>
        {user.about && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-slate-700 whitespace-pre-wrap">{user.about}</p>
          </div>
        )}
        {user.socialLinks?.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="font-semibold mb-2">Links</h2>
            <ul className="space-y-1">
              {user.socialLinks.map((l, i) => (
                <li key={i}><a href={l.url} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">{l.platform || l.url}</a></li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 pt-6 border-t text-sm text-slate-600">
          < div>📞 {user.phone}</div>
          <div>📧 {user.email}</div>
         
          <div>Gender: {user.gender?.replaceAll("_", " ")}</div>
          {user.address && <div>🏠 {user.address}</div>}
        </div>
      </div>
    </div>
  );
}
