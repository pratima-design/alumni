import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "unreadNotifications";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadInitial() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return null;
  return parsed;
}

function computeTotal(unreadDm, unreadGroups) {
  const dmTotal = Object.values(unreadDm || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const groupTotal = Object.values(unreadGroups || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  return dmTotal + groupTotal;
}

const persisted = loadInitial();

const initialState = {
  unreadDm: persisted?.unreadDm || {},
  unreadGroups: persisted?.unreadGroups || {},
  activeDmUserId: null,
  activeGroupId: null,
};

const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setActiveDmUserId: (s, a) => {
      s.activeDmUserId = a.payload ?? null;
    },
    setActiveGroupId: (s, a) => {
      s.activeGroupId = a.payload ?? null;
    },

    // Increment unread count for a DM thread (keyed by sender/other user id).
    receiveDm: (s, a) => {
      const fromUserId = String(a.payload?.fromUserId ?? "");
      if (!fromUserId) return;
      if (String(s.activeDmUserId ?? "") === fromUserId) return; // currently open
      s.unreadDm[fromUserId] = (s.unreadDm[fromUserId] || 0) + 1;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ unreadDm: s.unreadDm, unreadGroups: s.unreadGroups }));
      } catch {}
    },

    receiveGroup: (s, a) => {
      const groupId = String(a.payload?.groupId ?? "");
      if (!groupId) return;
      if (String(s.activeGroupId ?? "") === groupId) return; // currently open
      s.unreadGroups[groupId] = (s.unreadGroups[groupId] || 0) + 1;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ unreadDm: s.unreadDm, unreadGroups: s.unreadGroups }));
      } catch {}
    },

    markDmRead: (s, a) => {
      const fromUserId = String(a.payload?.fromUserId ?? "");
      if (!fromUserId) return;
      delete s.unreadDm[fromUserId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ unreadDm: s.unreadDm, unreadGroups: s.unreadGroups }));
      } catch {}
    },

    markGroupRead: (s, a) => {
      const groupId = String(a.payload?.groupId ?? "");
      if (!groupId) return;
      delete s.unreadGroups[groupId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ unreadDm: s.unreadDm, unreadGroups: s.unreadGroups }));
      } catch {}
    },
  },
});

export const {
  setActiveDmUserId,
  setActiveGroupId,
  receiveDm,
  receiveGroup,
  markDmRead,
  markGroupRead,
} = slice.actions;

export function selectUnreadDmCount(state) {
  return Object.values(state.notifications?.unreadDm || {}).reduce((a, b) => a + (Number(b) || 0), 0);
}

export function selectUnreadGroupCount(state) {
  return Object.values(state.notifications?.unreadGroups || {}).reduce((a, b) => a + (Number(b) || 0), 0);
}

export function selectTotalUnread(state) {
  const { unreadDm, unreadGroups } = state.notifications || {};
  return computeTotal(unreadDm, unreadGroups);
}

export default slice.reducer;

