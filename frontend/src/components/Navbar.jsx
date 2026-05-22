import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { selectTotalUnread, selectUnreadDmCount, selectUnreadGroupCount } from "../redux/slices/notificationsSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const totalUnread = useSelector(selectTotalUnread);
  const unreadDm = useSelector(selectUnreadDmCount);
  const unreadGroups = useSelector(selectUnreadGroupCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    close();
    dispatch(logout());
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  // Desktop nav link style
  const desktopLink = "relative px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors duration-200";

  // Mobile nav link — full-width row with icon area + label + optional badge
  const MobileLink = ({ to, icon, label, badge, danger }) => (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
          danger
            ? "text-red-600 hover:bg-red-50"
            : isActive
            ? "bg-blue-50 text-blue-600"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      <span className="text-lg w-6 text-center leading-none">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/feed" className="flex-shrink-0 flex items-center gap-1">
            <span className="text-2xl font-extrabold tracking-tight text-blue-600">
              Alumni<span className="text-slate-900">Connect</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center space-x-1">
            
            <Link to="/feed" className={desktopLink}>Feed</Link>
            <Link to="/announcements" className={desktopLink}>Announcements</Link>
            <Link to="/directory" className={desktopLink}>Directory</Link>
            <Link to="/messages" className={desktopLink}>
              Messages
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </Link>
            <Link to="/groups" className={desktopLink}>Groups</Link>
          </nav>

          {/* Desktop right: avatar + logout */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to={`/profile/${user?._id}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
            >
              {user?.photo ? (
                <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="hidden lg:block text-sm font-semibold text-slate-700">
                {user?.name?.split(" ")[0]}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all active:scale-95"
            >
              Logout
            </button>
          </div>

          {/* Mobile: avatar preview + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mini avatar */}
            <Link to={`/profile/${user?._id}`} onClick={close}>
              {user?.photo ? (
                <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </Link>

            {/* Unread badge on hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {totalUnread > 0 && !isOpen && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          {/* User info strip */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 bg-slate-50">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="px-3 py-3 space-y-1">
            <MobileLink to="/feed"          icon="📰" label="Feed" />
            <MobileLink to="/announcements" icon="📢" label="Announcements" />
            <MobileLink to="/messages"      icon="💬" label="Messages"        badge={unreadDm} />
            <MobileLink to="/groups"        icon="👨‍👩‍👧" label="Groups"          badge={unreadGroups} />
            <MobileLink to="/directory"     icon="👥" label="Directory" />

            <div className="border-t border-slate-100 my-2" />

            <MobileLink to={`/profile/${user?._id}`} icon="🙍" label="My Profile" />
            <MobileLink to="/profile/edit"           icon="⚙️" label="Edit Profile" />

            {isAdmin && (
              <MobileLink to="/admin" icon="🛡️" label="User Management" />
            )}

            <div className="border-t border-slate-100 my-2" />

            {/* Logout — button styled to match MobileLink */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="text-lg w-6 text-center leading-none">🚪</span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
