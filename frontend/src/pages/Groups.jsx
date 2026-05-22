import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../services/api";
import { connectSocket } from "../sockets/socket";
import { markGroupRead, setActiveGroupId } from "../redux/slices/notificationsSlice";

function AddMemberSearch({ groupId, onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
        setResults(data);
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const add = async (userId, name) => {
    try {
      await api.post(`/groups/${groupId}/members`, { userId });
      toast.success(`${name} added to group`);
      setQuery(""); setResults([]);
      onAdded();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="p-3 border-b relative shrink-0">
      <p className="text-xs font-semibold text-slate-500 mb-1">Add member by name or roll no.</p>
      <input
        className="input text-sm"
        placeholder="Search name or roll no…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {(results.length > 0 || loading) && (
        <div className="absolute left-3 right-3 bg-white border rounded shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
          {loading && <div className="p-2 text-xs text-slate-400">Searching…</div>}
          {results.map((u) => (
            <button
              key={u._id}
              onClick={() => add(u._id, u.name)}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {u.name[0]}
              </div>
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-slate-400">{u.role}{u.rollNo ? ` · ${u.rollNo}` : ""}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MembersDrawer({ members, onClose, onRemove, canRemove, currentUserId }) {
  return (
    <div className="absolute inset-0 bg-white z-20 flex flex-col">
      <div className="p-3 border-b flex items-center justify-between shrink-0">
        <span className="font-semibold">{members.length} Members</span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-lg leading-none">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {members.map((m) => {
          const memberId = m._id || m;
          const memberName = m.name || "Unknown";
          const memberRole = m.role || "";
          const isMe = memberId === currentUserId;
          return (
            <div key={memberId} className="flex items-center gap-3 px-4 py-3 border-b hover:bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold shrink-0">
                {memberName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{memberName} {isMe && <span className="text-xs text-slate-400">(you)</span>}</p>
                <p className="text-xs text-slate-400 capitalize">{memberRole}</p>
              </div>
              {canRemove && !isMe && (
                <button
                  onClick={() => onRemove(memberId, memberName)}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1 shrink-0"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Groups() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showChat, setShowChat] = useState(false); // mobile nav
  const socketRef = useRef(null);
  const endRef = useRef(null);

  // faculty can NO LONGER add/remove members — only admin and alumni
  const canCreate      = user?.role === "admin" || user?.role === "alumni";
  const canAddMember   = user?.role === "admin" || user?.role === "alumni";
  const canRemoveMember = user?.role === "admin" || user?.role === "alumni";

  const loadGroups = () => api.get("/groups/me").then((r) => setGroups(r.data));

  useEffect(() => {
    loadGroups();
    socketRef.current = connectSocket();
  }, []);

  // Keep active in a ref for the socket handler to avoid re-registering
  const activeRef = useRef(null);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    if (!active || !socketRef.current) return;
    api.get(`/messages/group/${active._id}`).then((r) => setMessages(r.data));
    socketRef.current.emit("group:join", active._id);

    const handler = ({ groupId, message }) => {
      if (groupId === activeRef.current?._id) {
        setMessages((m) => {
          if (m.some((msg) => msg._id === message._id)) return m;
          return [...m, message];
        });
      }
    };

    socketRef.current.on("group:receive", handler);
    return () => {
      socketRef.current?.emit("group:leave", active._id);
      socketRef.current?.off("group:receive", handler);
    };
  }, [active?._id]);

  useEffect(() => {
    if (!active?._id) return;
    dispatch(setActiveGroupId(active._id));
    dispatch(markGroupRead({ groupId: active._id }));
    return () => dispatch(setActiveGroupId(null));
  }, [active?._id, dispatch]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const refreshActive = () => {
    loadGroups();
    if (active) api.get(`/groups/${active._id}`).then((r) => setActive(r.data));
  };

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/groups", { name });
    toast.success("Group created"); setName(""); setCreating(false); loadGroups();
  };

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    const trimmed = text.trim();
    setText("");
    try {
      const { data } = await api.post("/messages/group", { groupId: active._id, text: trimmed });
      setMessages((m) => {
        if (m.some((msg) => msg._id === data._id)) return m;
        return [...m, data];
      });
      socketRef.current?.emit("group:send", { groupId: active._id, message: data });
    } catch {
      setText(trimmed); // restore on error
    }
  };

  const removeMember = async (memberId, memberName) => {
    if (!confirm(`Remove ${memberName} from the group?`)) return;
    try {
      await api.delete(`/groups/${active._id}/members/${memberId}`);
      toast.success(`${memberName} removed`);
      refreshActive();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to remove member");
    }
  };

  const SidebarPanel = (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex justify-between items-center shrink-0">
        <span className="font-semibold">Groups</span>
        {canCreate && (
          <button className="btn-ghost text-sm py-1 px-3" onClick={() => setCreating(!creating)}>
            + New
          </button>
        )}
      </div>
      {creating && (
        <form onSubmit={create} className="p-3 border-b shrink-0">
          <input className="input mb-2 text-sm" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn-primary w-full text-sm">Create</button>
        </form>
      )}
      <div className="flex-1 overflow-y-auto min-h-0">
        {groups.length === 0 && <div className="p-4 text-sm text-slate-500">No groups yet.</div>}
        {groups.map((g) => (
          <button
            key={g._id}
            onClick={() => { setActive(g); setShowMembers(false); setShowChat(true); }}
            className={`block w-full text-left p-3 border-b hover:bg-slate-50 ${active?._id === g._id ? "bg-brand-50" : ""}`}
          >
            <div className="font-medium text-sm">{g.name}</div>
            <div className="text-xs text-slate-500">{g.members.length} members</div>
          </button>
        ))}
      </div>
    </div>
  );

  const ChatPanel = (
    <div className="flex flex-col h-full relative">
      {!active ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Select a group</div>
      ) : (
        <>
          <div className="p-3 border-b font-semibold flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              {/* Back button on mobile */}
              <button
                className="md:hidden text-brand-500 mr-1 shrink-0"
                onClick={() => setShowChat(false)}
                aria-label="Back"
              >
                ←
              </button>
              <span className="truncate">{active.name}</span>
            </div>
            <button
              onClick={() => setShowMembers(true)}
              className="text-xs text-brand-500 hover:underline border border-brand-200 rounded px-2 py-1 shrink-0 ml-2"
            >
              👥 {active.members?.length || 0} Members
            </button>
          </div>

          {showMembers && (
            <MembersDrawer
              members={active.members || []}
              onClose={() => setShowMembers(false)}
              onRemove={removeMember}
              canRemove={canRemoveMember}
              currentUserId={user._id}
            />
          )}

          {canAddMember && (
            <AddMemberSearch groupId={active._id} onAdded={refreshActive} />
          )}

          <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-2 bg-slate-50">
            {messages.map((m) => {
              const mine = (m.sender?._id || m.sender) === user._id;
              return (
                <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"} flex-col ${mine ? "items-end" : "items-start"}`}>
                  {!mine && <div className="text-xs text-slate-500 mb-1">{m.sender?.name}</div>}
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
