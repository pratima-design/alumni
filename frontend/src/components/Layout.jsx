import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { connectSocket } from "../sockets/socket";
import { receiveDm, receiveGroup, setActiveDmUserId, setActiveGroupId } from "../redux/slices/notificationsSlice";

export default function Layout() {
  const dispatch = useDispatch();
  const { activeDmUserId, activeGroupId } = useSelector((s) => s.notifications);
  const activeDmUserIdRef = useRef(activeDmUserId ?? null);
  const activeGroupIdRef = useRef(activeGroupId ?? null);
  const socketRef = useRef(null);

  useEffect(() => {
    activeDmUserIdRef.current = activeDmUserId ?? null;
  }, [activeDmUserId]);

  useEffect(() => {
    activeGroupIdRef.current = activeGroupId ?? null;
  }, [activeGroupId]);

  useEffect(() => {
    socketRef.current = connectSocket();
    if (!socketRef.current) return;

    const onDmReceive = ({ from }) => {
      const fromId = String(from ?? "");
      if (!fromId) return;
      if (String(activeDmUserIdRef.current ?? "") === fromId) return;
      dispatch(receiveDm({ fromUserId: fromId }));
    };

    const onGroupReceive = ({ groupId }) => {
      const gid = String(groupId ?? "");
      if (!gid) return;
      if (String(activeGroupIdRef.current ?? "") === gid) return;
      dispatch(receiveGroup({ groupId: gid }));
    };

    socketRef.current.on("dm:receive", onDmReceive);
    socketRef.current.on("group:receive", onGroupReceive);

    return () => {
      socketRef.current?.off("dm:receive", onDmReceive);
      socketRef.current?.off("group:receive", onGroupReceive);
      dispatch(setActiveDmUserId(null));
      dispatch(setActiveGroupId(null));
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="hidden md:block col-span-3"><Sidebar /></aside>
        <main className="col-span-12 md:col-span-9"><Outlet /></main>
      </div>
    </div>
  );
}
