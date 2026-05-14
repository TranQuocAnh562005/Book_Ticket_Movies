import express from "express";
import { getAllMovies, syncMoviesWithTMDB } from "../controllers/moviesControllers.js";

const router = express.Router();

router.post("/sync", syncMoviesWithTMDB);
router.get("/", getAllMovies);

export default router;

