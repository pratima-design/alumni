import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../services/api";
import { toggleLike, fetchPosts } from "../redux/slices/postsSlice";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [comments, setComments] = useState([]);
  const [showComments, setShow] = useState(false);
  const [text, setText] = useState("");
  const [imgLoaded, setImgLoaded] = useState({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (showComments) api.get(`/comments/post/${post._id}`).then((r) => setComments(r.data));
  }, [showComments, post._id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post(`/comments/post/${post._id}`, { text });
    setComments((c) => [...c, data]); setText("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      dispatch(fetchPosts());
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${post.author._id}`}>
          {post.author.photo ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
              {!imgLoaded[post._id + "_avatar"] && (
                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
              )}
              <img
                src={post.author.photo}
                className={`w-10 h-10 rounded-full object-cover transition-opacity ${imgLoaded[post._id + "_avatar"] ? "opacity-100" : "opacity-0 absolute"}`}
                alt=""
                onLoad={() => setImgLoaded((p) => ({ ...p, [post._id + "_avatar"]: true }))}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">{post.author.name[0]}</div>
          )}
        </Link>
        <div>
          <Link to={`/profile/${post.author._id}`} className="font-semibold hover:underline">{post.author.name}</Link>
          <div className="text-xs text-slate-500">{post.author.designation || post.author.role} • {new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap">{post.content}</p>
      {post.sharedPost && (
        <div className="mt-3 p-3 rounded bg-slate-50 border">
          <div className="text-xs text-slate-500 mb-1">Shared post</div>
          <div className="font-semibold text-sm">{post.sharedPost.author?.name}</div>
          <div className="text-sm whitespace-pre-wrap">{post.sharedPost.content}</div>
        </div>
      )}
      {post.images?.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {post.images.map((src, i) => (
            <div key={i} className="relative rounded-md overflow-hidden bg-slate-200 aspect-video">
              {!imgLoaded[post._id + "_img_" + i] && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
              )}
              <img
                src={src}
                className={`w-full h-full object-cover transition-opacity ${imgLoaded[post._id + "_img_" + i] ? "opacity-100" : "opacity-0"}`}
                alt=""
                onLoad={() => setImgLoaded((p) => ({ ...p, [post._id + "_img_" + i]: true }))}
              />
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 pt-3 border-t flex gap-4 text-sm text-slate-600">
        <button onClick={() => dispatch(toggleLike(post._id))} className="hover:text-brand-500">👍 {post.likes?.length || 0} Like</button>
        <button onClick={() => setShow(!showComments)} className="hover:text-brand-500">💬 Comment</button>
        {/* Share option removed for all users */}
        {["admin", "faculty", "alumni"].includes(user?.role) && (user?.role === "admin" || user?._id === post.author._id) && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="hover:text-red-500 disabled:opacity-50 flex items-center gap-1"
          >
            {deleting ? (
              <><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Deleting...</>
            ) : "Delete"}
          </button>
        )}
      </div>
      {showComments && (
        <div className="mt-3 space-y-2">
          {comments.map((c) => (
            <div key={c._id} className="bg-slate-50 p-2 rounded">
              <div className="text-sm font-semibold">{c.author.name}</div>
              <div className="text-sm">{c.text}</div>
            </div>
          ))}
          <form onSubmit={submit} className="flex gap-2">
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." />
            <button className="btn-primary">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
