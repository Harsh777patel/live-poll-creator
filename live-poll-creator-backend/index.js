require('dotenv').config();
require('./connection'); // Establish DB connection at startup

//importing express
const express = require("express");
const RoomRouter = require("./routers/roomRouter");
const UserRouter = require("./routers/userRouter");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on('join-room', (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
  });

  socket.on('set-question', (payload) => {
    // console.log(`Question "${payload.question}" sent to room: ${payload.roomName}`);
    // Send to all clients in the room including sender
    socket.to(payload.roomName).emit('get-question', payload);
  });

  socket.on('send-response', ({ response, roomName }) => {
    // console.log(`Response "${response}" sent to room: ${roomName}`);
    socket.to(roomName).emit('get-response', response);
  });

  socket.on('disconnect', () => {
    console.log("Client disconnected:", socket.id);
  });
});

//creating an express app


const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use("/user", UserRouter);
app.use("/room", RoomRouter);

//route or endpoint
app.get("/", (req, res) => {
  res.send("response to express");
});
//starting the server
httpServer.listen(port, () => {
  console.log("Server Started");
});
