import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const stored = localStorage.getItem("user");
const initialState = {
  user: stored ? JSON.parse(stored) : null,
  token: localStorage.getItem("token"),
  status: "idle",
  error: null,
};

export const login = createAsyncThunk("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", creds);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || "Login failed"); }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || "Register failed"); }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    return (await api.post("/auth/forgot-password", payload)).data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || "Request failed"); }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    return (await api.post("/auth/reset-password", payload)).data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || "Reset failed"); }
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try { return (await api.get("/auth/me")).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (s) => {
      localStorage.removeItem("token"); localStorage.removeItem("user");
      s.user = null; s.token = null;
    },
    updateUser: (s, a) => {
      s.user = { ...s.user, ...a.payload };
      localStorage.setItem("user", JSON.stringify(s.user));
    },
  },
  extraReducers: (b) => {
    b.addCase(login.fulfilled, (s, a) => { s.user = a.payload; s.token = a.payload.token; })
     .addCase(register.fulfilled, (s, a) => {
       if (a.payload.token) {
         s.user = a.payload;
         s.token = a.payload.token;
       }
     })
     .addCase(fetchMe.fulfilled, (s, a) => { s.user = { ...s.user, ...a.payload }; });
  },
});

export const { logout, updateUser } = slice.actions;
export default slice.reducer;
