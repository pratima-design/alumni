import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUnreadDmCount, selectUnreadGroupCount } from "../redux/slices/notificationsSlice";

const item = "block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100";
const active = "bg-brand-50 text-brand-700 font-medium";

export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);
  const unreadDm = useSelector(selectUnreadDmCount);
  const unreadGroups = useSelector(selectUnreadGroupCount);
  return (
    <div className="card p-3 sticky top-20">
      <div className="text-center pb-3 border-b">
        {user?.photo ? <img src={user.photo} className="w-16 h-16 rounded-full mx-auto" alt="" /> :
          <div className="w-16 h-16 rounded-full mx-auto bg-brand-500 text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>}
        <div className="mt-2 font-semibold">{user?.name}</div>
        <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
      </div>
      <nav className="mt-3 space-y-1">
        
        <NavLink to="/feed" end className={({isActive}) => `${item} ${isActive ? active : ""}`}>📰 Feed</NavLink>
        <NavLink to="/directory" className={({isActive}) => `${item} ${isActive ? active : ""}`}>👥 Directory</NavLink>

        
        <NavLink to="/groups" className={({isActive}) => `${item} ${isActive ? active : ""}`}>
          <span className="flex items-center justify-between gap-2 w-full">
            <span>👨‍👩‍👧 Groups</span>
            {unreadGroups > 0 && (
              <span className="bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full shadow">
                {unreadGroups > 99 ? "99+" : unreadGroups}
              </span>
            )}
          </span>
        
        </NavLink>
        <NavLink to="/messages" className={({isActive}) => `${item} ${isActive ? active : ""}`}>
          <span className="flex items-center justify-between gap-2 w-full">
            <span>💬 Messages</span>
            {unreadDm > 0 && (
              <span className="bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full shadow">
                {unreadDm > 99 ? "99+" : unreadDm}
              </span>
            )}
          </span>
        </NavLink>

        <NavLink to="/announcements" className={({isActive}) => `${item} ${isActive ? active : ""}`}>📢 Announcements</NavLink>
         <NavLink to="/profile/edit" className={({isActive}) => `${item} ${isActive ? active : ""}`}>⚙️ Edit Profile</NavLink>
       
        {user?.role === "admin" && (
          <NavLink to="/admin" className={({isActive}) => `${item} ${isActive ? active : ""}`}>🛡️ User Management</NavLink>
        )}
      </nav>
    </div>
  );
}
