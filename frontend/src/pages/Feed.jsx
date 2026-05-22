import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchPosts, createPost } from "../redux/slices/postsSlice";
import PostCard from "../components/PostCard";
import api from "../services/api";

export default function Feed() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.posts);
  const { user } = useSelector((s) => s.auth);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const canPost = ["admin", "faculty", "alumni"].includes(user?.role);

  useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

  const upload = async (file) => {
    setImgLoading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const { data } = await api.post("/upload?type=post", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setImages((arr) => [...arr, data.url]);
    } finally {
      setImgLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const res = await dispatch(createPost({ content, images }));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Posted");
        setContent(""); setImages([]);
      }
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      {canPost && (
        <form onSubmit={submit} className="card p-4 mb-4">
          <textarea className="input min-h-[80px]" placeholder="Share an update, event, or activity..."
            value={content} onChange={(e) => setContent(e.target.value)} />
          {images.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {images.map((src, i) => <img key={i} src={src} className="w-20 h-20 rounded object-cover" alt="" />)}
            </div>
          )}
          <div className="flex justify-between items-center mt-3">
            <label className="btn-ghost cursor-pointer flex items-center gap-1">
              {imgLoading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Uploading...</>
              ) : "📷 Add image"}
              <input type="file" hidden accept="image/*" disabled={imgLoading} onChange={(e) => e.target.files[0] && upload(e.target.files[0])} />
            </label>
            <button className="btn-primary flex items-center gap-2" disabled={posting}>
              {posting ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Posting...</>
              ) : "Post"}
            </button>
          </div>
        </form>
      )}
      {items.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No posts yet.</div>
      ) : items.map((p) => <PostCard key={p._id} post={p} />)}
    </div>
  );
}
