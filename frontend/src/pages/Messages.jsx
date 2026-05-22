import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { connectSocket } from "../sockets/socket";
import { markDmRead, setActiveDmUserId } from "../redux/slices/notificationsSlice";

export default function Messages() {
  const { userId } = useParams();
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [other, setOther] = useState(null);
  const [search, setSearch] = useState("");
  const [showChat, setShowChat] = useState(false); // mobile: show chat panel
  const socketRef = useRef(null);
  const endRef = useRef(null);

  const filteredThreads = threads.filter((t) =>
    t.user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Set up socket once; keep 'other' in a ref to avoid re-registering
  const otherRef = useRef(null);
  useEffect(() => { otherRef.current = other; }, [other]);

  useEffect(() => {
    socketRef.current = connectSocket();
    api.get("/messages/inbox").then((r) => setThreads(r.data));
    if (!socketRef.current) return;

    const onReceive = ({ from, message }) => {
      // Only add if this message doesn't already exist (prevent duplicate with optimistic add)
      if (otherRef.current && from === otherRef.current._id) {
        setMessages((m) => {
          if (m.some((msg) => msg._id === message._id)) return m;
          return [...m, message];
        });
      }
    };

    socketRef.current.on("dm:receive", onReceive);
    return () => socketRef.current?.off("dm:receive", onReceive);
  }, []); // only once

  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}`).then((r) => setOther(r.data));
    api.get(`/messages/direct/${userId}`).then((r) => setMessages(r.data));
    setShowChat(true);
  }, [userId]);

  useEffect(() => {
    if (!other?._id) return;
    dispatch(setActiveDmUserId(other._id));
    dispatch(markDmRead({ fromUserId: other._id }));
    return () => { dispatch(setActiveDmUserId(null)); };
  }, [other?._id, dispatch]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !other) return;
    const trimmed = text.trim();
    setText("");
    try {
      const { data } = await api.post("/messages/direct", { recipient: other._id, text: trimmed });
      // Add optimistically; dedup by _id if socket also fires
      setMessages((m) => {
        if (m.some((msg) => msg._id === data._id)) return m;
        return [...m, data];
      });
      socketRef.current?.emit("dm:send", { to: other._id, message: data });
    } catch {
      setText(trimmed); // restore on error
    }
  };

  const SidebarPanel = (
    <div className="flex flex-col h-full">
      <div className="p-3 font-semibold border-b flex items-center justify-between shrink-0">
        <span>Conversations</span>
      </div>
      <div className="p-2 border-b shrink-0">
        <div className="relative">
          <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            className="input pl-8 text-sm py-1.5"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredThreads.length === 0 && (
          <div className="p-4 text-sm text-slate-500">
            {search ? "No conversations match your search." : "No conversations yet. Open someone's profile to message them."}
          </div>
        )}
        {filteredThreads.map((t) => (
          <Link
            key={t.user._id}
            to={`/messages/${t.user._id}`}
            onClick={() => setShowChat(true)}
            className={`block p-3 border-b hover:bg-slate-50 ${userId === t.user._id ? "bg-brand-50" : ""}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {t.user.name[0]}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm">{t.user.name}</div>
                <div className="text-xs text-slate-500 truncate">{t.lastMessage?.text}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const ChatPanel = (
    <div className="flex flex-col h-full">
      {!other ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Select a conversation
        </div>
      ) : (
        <>
          <div className="p-3 border-b font-semibold flex items-center gap-2 shrink-0">
            {/* Back button on mobile */}
            <button
              className="md:hidden text-brand-500 mr-1"
              onClick={() => setShowChat(false)}
              aria-label="Back"
            >
              ←
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {other.name[0]}
            </div>
            <span>{other.name}</span>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-2 bg-slate-50">
            {messages.map((m) => {
              const mine = (m.sender?._id || m.sender) === user._id;
              return (
                <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-2xl max-w-[75%] text-sm ${mine ? "bg-brand-500 text-white" : "bg-white border"}`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="p-3 border-t flex gap-2 shrink-0 bg-white">
            <input
              className="input text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
            />
            <button className="btn-primary text-sm px-4 shrink-0">Send</button>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="card overflow-hidden" style={{ height: "calc(100vh - 120px)", minHeight: "400px" }}>
      {/* Desktop: side-by-side */}
      <div className="hidden md:grid grid-cols-12 h-full">
        <div className="col-span-4 border-r h-full overflow-hidden">{SidebarPanel}</div>
        <div className="col-span-8 h-full overflow-hidden">{ChatPanel}</div>
      </div>
      {/* Mobile: toggle between panels */}
      <div className="md:hidden h-full overflow-hidden">
        {showChat ? ChatPanel : SidebarPanel}
      </div>
    </div>
  );
}
