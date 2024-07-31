const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const http = require('http');
const socketIo = require('socket.io');
const User = require('./modals/userModel'); // Import the User model

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "https://dummy-succ-client.onrender.com",
  })
);

app.use(express.json());

const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is Connected to Database");
  } catch (err) {
    console.log("Server is NOT connected to Database", err.message);
  }
};
connectDb();

app.get("/", (req, res) => {
  res.send("API is running123");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// Configure socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: "https://dummy-succ-client.onrender.com", // Your React app URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('updateStatus', async ({ userId, status }) => {
    try {
      await User.findByIdAndUpdate(userId, { status }, { new: true });
      io.emit('userStatus', { userId, status });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
