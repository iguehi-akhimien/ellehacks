const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User sends a transcribed message
    socket.on("user-message", (data) => {
        console.log("User sent:", data);
        io.emit("helper-receive", data); // Send to helper
    });

    // Helper replies to the user
    socket.on("helper-message", (data) => {
        console.log("Helper replied:", data);
        io.emit("user-receive", data); // Send to user
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
