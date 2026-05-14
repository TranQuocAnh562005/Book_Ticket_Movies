import Movie from "../models/Movie.js";

export const syncMoviesWithTMDB = async (req, res) => {
  try {
    const API_KEY = process.env.VITE_API_KEY || process.env.TMDB_API_KEY;
    if (!API_KEY) {
      return res.status(400).json({ message: "TMDB API key not configured" });
    }

    // Fetch now playing movies from TMDB
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=vi-VN&region=VN&page=1`
    );
    const tmdbData = await tmdbRes.json();

    if (!tmdbData.results) {
      return res.status(400).json({ message: "Failed to fetch from TMDB" });
    }

    let updated = 0;
    for (const tmdbMovie of tmdbData.results) {
      await Movie.updateOne(
        { tmdbId: tmdbMovie.id },
        {
          $set: {
            tmdbId: tmdbMovie.id,
            source: "tmdb",
            tmdbRaw: {
              title: tmdbMovie.title,
              poster: tmdbMovie.poster_path, // TMDB uses poster_path
              releaseDate: tmdbMovie.release_date,
              rating: tmdbMovie.vote_average,
              overview: tmdbMovie.overview,
              backdropPath: tmdbMovie.backdrop_path,
            },
          },
        },
        { upsert: true }
      );
      updated++;
    }

    res.status(200).json({
      message: "Movies synced successfully",
      updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to sync movies", error: error.message });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).lean();
    // Support both old format (title, posterUrl) and new format (tmdbRaw)
    const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500";
    const mapped = (movies || []).map((m) => {
      let posterUrl = null;
      // Get poster URL from tmdbRaw.poster (path from TMDB)
      if (m.tmdbRaw?.poster) {
        posterUrl = `${TMDB_IMG_BASE}${m.tmdbRaw.poster}`;
      } else if (m.posterUrl) {
        // Fallback to local posterUrl from old movies
        posterUrl = m.posterUrl;
      }

      return {
        tmdbId: m.tmdbId,
        id: m.tmdbId || m._id.toString(),
        title: m.tmdbRaw?.title || m.title || "",
        poster_path: posterUrl, // Full URL for frontend to use directly
        release_date: m.tmdbRaw?.releaseDate || m.releaseDate || null,
        rating: m.tmdbRaw?.rating || m.rating || 0,
        raw: m.tmdbRaw || {
          title: m.title,
          poster: m.posterUrl,
          releaseDate: m.releaseDate,
          rating: m.rating,
        },
      };
    });
    res.status(200).json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load movies" });
  }
};

