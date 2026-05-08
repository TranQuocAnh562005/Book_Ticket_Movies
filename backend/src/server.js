import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import taskRoute from "./routes/tasksRouters.js";
import authRoute from "./routes/authRouters.js";
import moviesRoute from "./routes/moviesRouters.js";
import newsRoute from "./routes/newsRouters.js";
import cinemasRoute from "./routes/cinemasRouters.js";
import showtimesRoute from "./routes/showtimesRouters.js";
import bookingsRoute from "./routes/bookingsRouters.js";
import paymentRoute from "./routes/paymentRouters.js";
import { connectDB } from "./config/db.js";

// Load biến môi trường
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory Map for holding seats
// key: "showtimeId:seatCode", value: { userId, timer, expiresAt }
const heldSeatsMap = new Map();
// Keep track of which user holds which seats for quick cleanup on disconnect
// key: userId, value: Set of "showtimeId:seatCode"
const userHeldSeats = new Map();

app.use((req, res, next) => {
  req.io = io;
  req.heldSeatsMap = heldSeatsMap;
  req.userHeldSeats = userHeldSeats;
  next();
});



io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join:showtime", ({ showtimeId, userId }) => {
    socket.join(showtimeId);
    socket.userId = userId; // Store userId in socket instance
    console.log(`User ${userId} joined showtime ${showtimeId}`);
    
    // Send currently held seats in this showtime to the joining user
    const currentHeldSeats = [];
    for (const [key, value] of heldSeatsMap.entries()) {
      const [heldShowtimeId, seatCode] = key.split(":");
      if (heldShowtimeId === showtimeId) {
        currentHeldSeats.push({
          seatCode,
          userId: value.userId,
          expiresAt: value.expiresAt
        });
      }
    }
    socket.emit("seat:initial_held", currentHeldSeats);
  });

  socket.on("seat:hold", ({ showtimeId, seatCode, userId }) => {
    const key = `${showtimeId}:${seatCode}`;
    
    if (heldSeatsMap.has(key)) return; // Already held

    const timerDuration = 600000; // 10 minutes
    const expiresAt = Date.now() + timerDuration;
    
    const timer = setTimeout(() => {
      heldSeatsMap.delete(key);
      if (userHeldSeats.has(userId)) {
        userHeldSeats.get(userId).delete(key);
      }
      io.to(showtimeId).emit("seat:released", { seatCode, showtimeId });
      console.log(`Seat ${seatCode} for showtime ${showtimeId} released due to timeout.`);
    }, timerDuration);

    heldSeatsMap.set(key, { userId, timer, expiresAt });
    
    if (!userHeldSeats.has(userId)) {
      userHeldSeats.set(userId, new Set());
    }
    userHeldSeats.get(userId).add(key);

    io.to(showtimeId).emit("seat:held", { seatCode, userId, expiresAt, showtimeId });
  });

  socket.on("seat:unhold", ({ showtimeId, seatCode, userId }) => {
    const key = `${showtimeId}:${seatCode}`;
    const heldSeat = heldSeatsMap.get(key);
    
    if (heldSeat && heldSeat.userId === userId) {
      clearTimeout(heldSeat.timer);
      heldSeatsMap.delete(key);
      
      if (userHeldSeats.has(userId)) {
        userHeldSeats.get(userId).delete(key);
      }

      io.to(showtimeId).emit("seat:released", { seatCode, showtimeId });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // NOTE: Chúng ta KHÔNG release ghế khi disconnect nữa. 
    // Ghế sẽ được giữ trong 10 phút nhờ setTimeout, để người dùng có thời gian
    // chuyển sang trang Thanh toán mà không bị mất ghế.
  });
});

// Route test server
app.get("/", (req, res) => {
  res.status(200).send("TicketFlix backend is running 🚀");
});


// API routes
app.use("/api/tasks", taskRoute);
app.use("/api/auth", authRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/news", newsRoute);
app.use("/api/cinemas", cinemasRoute);
app.use("/api/showtimes", showtimesRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/payment", paymentRoute);

// Connect database
connectDB();

// PORT (quan trọng cho Render)
const PORT = process.env.PORT || 5001;

// Start server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("===================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment PORT: ${process.env.PORT}`);
  console.log("===================================");
});
