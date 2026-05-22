import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchPosts = createAsyncThunk("posts/list", async (page = 1) =>
  (await api.get(`/posts?page=${page}&limit=20`)).data
);
export const createPost = createAsyncThunk("posts/create", async (payload) =>
  (await api.post("/posts", payload)).data
);
export const toggleLike = createAsyncThunk("posts/like", async (id) => ({
  id, ...(await api.post(`/posts/${id}/like`)).data,
}));

const slice = createSlice({
  name: "posts",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPosts.fulfilled, (s, a) => { s.items = a.payload.items; })
     .addCase(createPost.fulfilled, (s, a) => { s.items.unshift(a.payload); })
     .addCase(toggleLike.fulfilled, (s, a) => {
       const p = s.items.find((x) => x._id === a.payload.id);
       if (p) p.likes = Array(a.payload.likes).fill(0);
     });
  },
});
export default slice.reducer;
