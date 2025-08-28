import "./config/env.config.js";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected", socket);
});

server.listen(process.env.PORT, () => {
  console.log(`server is running on localhost:${process.env.PORT}`);
});
