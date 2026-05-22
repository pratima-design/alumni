import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import LoginLanding from "./pages/LoginLanding";
import RegisterLanding from "./pages/RegisterLanding";
import LoginRole from "./pages/LoginRole";
import RegisterRole from "./pages/RegisterRole";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Directory from "./pages/Directory";
import Messages from "./pages/Messages";
import Announcements from "./pages/Announcements";
import GroupsPage from "./pages/Groups";
import AdminPanel from "./pages/AdminPanel";

function Private({ children }) {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ children }) {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (!["admin"].includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* Login routes — :role = admin | faculty | alumni | student */}
      <Route path="/login" element={<LoginLanding />} />
      <Route path="/login/:role" element={<LoginRole />} />
      {/* Register routes — :role = faculty | alumni | student */}
      <Route path="/register" element={<RegisterLanding />} />
      <Route path="/register/:role" element={<RegisterRole />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<Private><Layout /></Private>}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:userId" element={<Messages />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/admin" element={<AdminOnly><AdminPanel /></AdminOnly>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
