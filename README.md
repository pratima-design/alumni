# Alumni Tracking & Interaction Web App (MERN Stack)

A comprehensive MERN stack application for alumni networking and interaction, featuring real-time messaging, role-based access control, and social media-like functionality.

**Tech Stack:** MongoDB + Express.js + React + Node.js + Socket.io + JWT + Cloudinary + Tailwind CSS

## 🚀 Features

### Authentication & Authorization
- **JWT-based authentication** with secure password hashing (bcrypt)
- **Role-based access control (RBAC)**: Admin, Alumni, Student
- First registered user automatically becomes Admin
- Persistent login with localStorage

### User Profiles
- LinkedIn-style profiles with photo, designation, batch year, department
- Social links, about section, address, location
- Profile editing and viewing

### Social Feed
- Global feed with posts, images, and file attachments
- Like system for posts
- Comments on posts
- Pagination for performance
- Role-restricted posting (Admin/Alumni only)

### Real-Time Communication
- **1-to-1 Direct Messages (DMs)** via Socket.io
- **Group chats** with member management
- Typing indicators
- Real-time notifications

### Group Management
- Admin/Alumni can create groups
- Group admins can add/remove members and promote admins
- Secure group messaging

### Announcements
- Admin/Alumni can post announcements
- Visible to all authenticated users

### Directory & Search
- Search/filter alumni by name, batch year, department, role
- Full-text search on user profiles

### File Uploads
- Image and file uploads for posts
- Cloudinary integration with local fallback
- Multipart form data handling

### Admin Panel
- Change user roles
- Delete users
- User management interface

## 🏗️ Architecture & Code Flow

### Backend Architecture

#### Entry Point (`server.js`)
- Initializes HTTP server
- Connects to MongoDB
- Sets up Socket.io with authentication
- Starts server on PORT (default 5000)

#### Express App (`app.js`)
- CORS configuration
- JSON/URL-encoded body parsing (10MB limit)
- Morgan logging
- Static file serving for uploads
- Health check endpoint (`/api/health`)
- Route mounting for all API endpoints
- Global error handling middleware

#### Database Models
- **User**: Profile data, role, password (hashed), social links
- **Post**: Author, content, images, files, likes, timestamps
- **Comment**: Post reference, author, content, timestamps
- **Message**: Direct/group messages with sender/receiver/group refs
- **Group**: Name, description, creator, members, admins
- **Announcement**: Title, content, author, timestamps

#### Authentication Flow
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Password hashed with bcrypt on save
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Subsequent requests include `Authorization: Bearer <token>`
6. `protect` middleware verifies JWT and attaches user to req
7. `authorize` middleware checks user role against required roles

#### Socket.io Real-Time Features
- JWT authentication on connection
- Personal rooms for DMs (`user:${userId}`)
- Group rooms for chat (`group:${groupId}`)
- Events: `dm:send/receive`, `group:send/receive`, `typing`

### Frontend Architecture

#### React App Structure
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Redux Toolkit** for state management
- **Axios** for API calls with automatic JWT headers
- **Socket.io Client** for real-time features
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications

#### State Management
- **authSlice**: User authentication state, login/register thunks
- **postsSlice**: Feed posts, create/like operations
- Local storage persistence for auth state

#### Component Hierarchy
- **App.jsx**: Route definitions with Private/AdminOnly guards
- **Layout.jsx**: Common layout with Navbar and Sidebar
- **Pages**: Login, Register, Feed, Profile, etc.
- **Components**: PostCard, Navbar, Sidebar for reusability

#### API Integration
- Axios interceptors add JWT to requests
- 401 responses trigger logout
- Base URL from environment variables

## 📁 Project Structure

```
alumni-mern/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary config
│   ├── controllers/           # Business logic handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT protection & role auth
│   │   └── error.middleware.js # Error handling
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── ...
│   ├── routes/                # Express routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── ...
│   ├── sockets/
│   │   └── index.js           # Socket.io setup
│   ├── utils/
│   │   └── generateToken.js   # JWT utility
│   ├── validators/            # Input validation
│   ├── seed/
│   │   └── seed.js            # Demo data seeding
│   ├── app.js                 # Express app config
│   └── server.js              # Server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   ├── pages/             # Route components
│   │   │   ├── Login.jsx
│   │   │   ├── Feed.jsx
│   │   │   └── ...
│   │   ├── redux/
│   │   │   ├── store.js       # Redux store config
│   │   │   └── slices/        # State slices
│   │   ├── services/
│   │   │   └── api.js         # Axios config
│   │   ├── sockets/
│   │   │   └── socket.js      # Socket.io client
│   │   ├── utils/
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🔧 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env  # If exists, or create manually
   ```

   Required environment variables in `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/alumni-app
   JWT_SECRET=your-super-secret-jwt-key-here
   CLIENT_ORIGIN=http://localhost:5173
   # Optional: Cloudinary for file uploads
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Seed demo data (optional):
   ```bash
   npm run seed
   ```
   Creates admin@example.com, alumni@example.com, student@example.com (password: `password`)

5. Start development server:
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env  # If exists, or create manually
   ```

   Environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   App runs on http://localhost:5173

### Testing Real-Time Features

Open the app in two browser windows/tabs and test messaging between users.

## 📡 API Reference

All protected routes require: `Authorization: Bearer <jwt-token>`

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Auth | Get current user |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Auth | List users with search/filters |
| GET | `/api/users/:id` | Auth | Get user profile |
| PUT | `/api/users/me` | Auth | Update own profile |
| PUT | `/api/users/:id/role` | Admin | Change user role |
| DELETE | `/api/users/:id` | Admin | Delete user |

### Posts
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/posts` | Auth | Get paginated feed |
| POST | `/api/posts` | Admin/Alumni | Create post |
| POST | `/api/posts/:id/like` | Auth | Toggle like |
| DELETE | `/api/posts/:id` | Author/Admin | Delete post |

### Comments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/comments/post/:postId` | Auth | Get post comments |
| POST | `/api/comments/post/:postId` | Auth | Add comment |

### Messages
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/messages/inbox` | Auth | Get DM threads |
| POST | `/api/messages/direct` | Auth | Send DM |
| GET | `/api/messages/direct/:userId` | Auth | Get DM thread |
| POST | `/api/messages/group` | Group Member | Send group message |
| GET | `/api/messages/group/:groupId` | Auth | Get group thread |

### Groups
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/groups/me` | Auth | Get user's groups |
| POST | `/api/groups` | Admin/Alumni | Create group |
| POST | `/api/groups/:id/members` | Group Admin | Add member |
| DELETE | `/api/groups/:id/members/:userId` | Group Admin | Remove member |
| POST | `/api/groups/:id/admins/:userId` | Group Admin | Promote to admin |

### Announcements
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/announcements` | Auth | List announcements |
| POST | `/api/announcements` | Admin/Alumni | Create announcement |
| DELETE | `/api/announcements/:id` | Author/Admin | Delete announcement |

### Uploads
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/upload` | Auth | Upload file/image |

## 🔌 Socket.io Events

Client connects with: `io(URL, { auth: { token } })`

### Direct Messages
| Event | Direction | Payload |
|---|---|---|
| `dm:send` | Client → Server | `{ to: userId, message: string }` |
| `dm:receive` | Server → Client | `{ from: userId, message: string }` |

### Group Messages
| Event | Direction | Payload |
|---|---|---|
| `group:join` | Client → Server | `groupId` |
| `group:leave` | Client → Server | `groupId` |
| `group:send` | Client → Server | `{ groupId, message: string }` |
| `group:receive` | Server → Client | `{ from: userId, groupId, message: string }` |

### Typing Indicators
| Event | Direction | Payload |
|---|---|---|
| `typing` | Client → Server | `{ to: userId }` or `{ groupId }` |
| `typing` | Server → Client | `{ from: userId }` or `{ from: userId, groupId }` |

## 🚀 Deployment

### Backend Deployment
1. Choose a Node.js hosting service (Render, Railway, Fly.io, Heroku)
2. Set environment variables in production
3. Deploy from `backend/` directory
4. Ensure WebSocket support for Socket.io

### Frontend Deployment
1. Build the app: `npm run build`
2. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)
3. Set `VITE_API_URL` and `VITE_SOCKET_URL` to production backend URLs

### Database
- Use MongoDB Atlas for production
- Update `MONGO_URI` with connection string

### File Storage
- Configure Cloudinary credentials for production uploads
- Without Cloudinary, files save to local `/uploads` (not suitable for multi-server deployments)

## 🔒 Security Considerations

- **JWT Secrets**: Use long, random strings in production
- **CORS**: Restrict `CLIENT_ORIGIN` to your domain only
- **Rate Limiting**: Implement on auth endpoints
- **Input Validation**: Use express-validator for all inputs
- **Password Policies**: Enforce strong passwords
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit secrets to version control

## 🧪 Testing

- Test authentication flows
- Verify role-based access
- Test real-time messaging in multiple browser tabs
- Check file upload functionality
- Validate search and filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB 6+ running locally (or a MongoDB Atlas connection string)

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI and a strong JWT_SECRET
# (Cloudinary keys are optional — without them, uploads go to /uploads on disk)
npm install
npm run seed      # optional: creates admin/alumni/student demo users
npm run dev       # http://localhost:5000
```

Demo logins (after `npm run seed`, password is `password`):
- `admin@example.com`
- `alumni@example.com`
- `student@example.com`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev       # http://localhost:5173
```

Open http://localhost:5173 in two browsers/incognito windows to test real-time chat.

---

## REST API Reference

All protected routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | Register (1st user → admin) |
| POST | `/api/auth/login` | public | Login → JWT |
| GET  | `/api/auth/me` | auth | Current user |
| GET  | `/api/users?search=&role=&batchYear=&department=` | auth | Directory search |
| GET  | `/api/users/:id` | auth | View profile |
| PUT  | `/api/users/me` | auth | Update own profile |
| PUT  | `/api/users/:id/role` | admin | Change user role |
| DELETE | `/api/users/:id` | admin | Delete user |
| GET  | `/api/posts?page=&limit=` | auth | Feed (paginated) |
| POST | `/api/posts` | admin/alumni | Create post |
| POST | `/api/posts/:id/like` | auth | Toggle like |
| DELETE | `/api/posts/:id` | author/admin | Delete post |
| GET  | `/api/comments/post/:postId` | auth | List comments |
| POST | `/api/comments/post/:postId` | auth | Add comment |
| GET  | `/api/messages/inbox` | auth | DM threads list |
| POST | `/api/messages/direct` | auth | Send DM |
| GET  | `/api/messages/direct/:userId` | auth | DM thread |
| POST | `/api/messages/group` | auth(member) | Send group msg |
| GET  | `/api/messages/group/:groupId` | auth | Group thread |
| GET  | `/api/groups/me` | auth | My groups |
| POST | `/api/groups` | admin/alumni | Create group |
| POST | `/api/groups/:id/members` | group-admin | Add member |
| DELETE | `/api/groups/:id/members/:userId` | group-admin | Remove member |
| POST | `/api/groups/:id/admins/:userId` | group-admin | Promote to admin |
| GET  | `/api/announcements` | auth | List |
| POST | `/api/announcements` | admin/alumni | Create |
| DELETE | `/api/announcements/:id` | author/admin | Delete |
| POST | `/api/upload` | auth | Multipart file upload |

## Socket.io Events

Client connects with `io(URL, { auth: { token } })`.

| Event | Direction | Payload |
|---|---|---|
| `dm:send` | client → server | `{ to, message }` |
| `dm:receive` | server → client | `{ from, message }` |
| `group:join` / `group:leave` | client → server | `groupId` |
| `group:send` | client → server | `{ groupId, message }` |
| `group:receive` | server → client | `{ from, groupId, message }` |
| `typing` | both | `{ to | groupId, from }` |

---

## Deployment

- **Frontend**: `npm run build` → deploy `dist/` to Vercel/Netlify. Set `VITE_API_URL` and `VITE_SOCKET_URL` env vars to your backend URL.
- **Backend**: Deploy to Render / Railway / Fly.io as a Node service. Set all env vars from `.env.example`. Make sure your host supports WebSockets for Socket.io.
- **Database**: MongoDB Atlas free tier works fine.
- **Files**: Configure Cloudinary in production (disk uploads won't survive container restarts).

## Security notes

- Always set a long random `JWT_SECRET` in production.
- Configure CORS `CLIENT_ORIGIN` to your real frontend URL (not `*`).
- Rate-limit `/api/auth/login` and `/api/auth/register` (e.g. with `express-rate-limit`) before going live.
- Add input validation with `express-validator` on every controller for production hardening (basic checks included).
