import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import posts from "./slices/postsSlice";
import notifications from "./slices/notificationsSlice";

export const store = configureStore({ reducer: { auth, posts, notifications } });
