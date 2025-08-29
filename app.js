import "./config/env.config.js";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { generateResponse } from "./controllers/chat.controller.js";

const app = express();
const server = createServer(app);

console.log("CLIENT_URL:", process.env.CLIENT_URL);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

io.on("connection", (socket) => {
  socket.on("chat message", async (msg) => {
    const response = await generateResponse(msg);
    if (response) {
      io.to(socket.id).emit("chat message", response);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server is running on localhost:${process.env.PORT}`);
});
