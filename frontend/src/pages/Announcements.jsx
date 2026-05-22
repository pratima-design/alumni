import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../services/api";

const Spinner = ({ small }) => (
  <svg className={`animate-spin ${small ? "w-3 h-3" : "w-4 h-4"}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
);

export default function Announcements() {
  const { user } = useSelector((s) => s.auth);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", attachments: [] });
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const canPost = ["admin", "faculty", "alumni"].includes(user?.role);

  const load = () => api.get("/announcements").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post("/announcements", form);
      setForm({ title: "", description: "", attachments: [] });
      toast.success("Announcement posted"); load();
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id) => {
    await api.delete(`/announcements/${id}`);
    toast.success("Announcement removed");
    load();
  };

  const uploadAttachment = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload?type=announcement", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, attachments: [...prev.attachments, { url: data.url, name: data.name }] }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {canPost && (
        <form onSubmit={submit} className="card p-4 mb-4 space-y-3">
          <h2 className="font-semibold">New Announcement</h2>
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input min-h-[100px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <label className="btn-ghost cursor-pointer border border-slate-300 w-fit flex items-center gap-2">
            {uploading ? <><Spinner small /> Uploading...</> : "Add attachment"}
            <input type="file" hidden disabled={uploading} onChange={(e) => e.target.files?.[0] && uploadAttachment(e.target.files[0])} />
          </label>
          {form.attachments.length > 0 && (
            <div className="text-xs text-slate-500">{form.attachments.length} attachment(s) added</div>
          )}
          <button className="btn-primary flex items-center gap-2" disabled={posting}>
            {posting ? <><Spinner /> Posting...</> : "Post Announcement"}
          </button>
        </form>
      )}
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a._id} className="card p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{a.title}</h3>
              <span className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-slate-500 mb-2">By {a.author.name}</p>
            <p className="whitespace-pre-wrap">{a.description}</p>
            {a.attachments?.length > 0 && (
              <div className="mt-2">
                {a.attachments.map((x, idx) => (
                  <a key={idx} href={x.url} target="_blank" rel="noreferrer" className="text-brand-500 text-sm mr-3">{x.name || `Attachment ${idx + 1}`}</a>
                ))}
              </div>
            )}
            {(["admin", "faculty", "alumni"].includes(user?.role) && (user?.role === "admin" || user?._id === a.author._id)) && (
              <button className="text-red-500 text-sm mt-2" onClick={() => remove(a._id)}>Delete</button>
            )}
          </div>
        ))}
        {items.length === 0 && <div className="card p-8 text-center text-slate-500">No announcements yet.</div>}
      </div>
    </div>
  );
}
