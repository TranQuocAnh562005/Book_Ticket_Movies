import express from "express";
import { createBooking, getMyBookings, getBookingQRCode } from "../controllers/bookingsControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyBookings);
router.post("/", protect, createBooking);
router.get("/:orderCode/qr", protect, getBookingQRCode);

export default router;
