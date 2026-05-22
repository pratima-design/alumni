require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const initSocket = require("./sockets");

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => console.log(`server is running on port :${PORT}`));
})();
