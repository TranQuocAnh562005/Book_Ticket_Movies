import { useEffect, useState } from "react";
import {
  getNowPlayingMovies,
  getUpcomingMovies,
} from "../services/movies";
import { Link } from "react-router-dom";
import video from "../assets/Tạo_Video_Giới_Thiệu_Kết_Thúc.mp4";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getFavorites, toggleFavorite } from "../services/favorites";
import { getMyBookings } from "../services/bookings";

function Movie() {
  const { isDark } = useTheme();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("Đang chiếu");

  // Advanced filters
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState(2026);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedRuntime, setSelectedRuntime] = useState("all");
  const [topGenres, setTopGenres] = useState([]);

  const [favoriteIds, setFavoriteIds] = useState([]);
  const { token } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreAPI, setHasMoreAPI] = useState(true);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const nowPlaying = await getNowPlayingMovies(1);
        const upcoming = await getUpcomingMovies(1);
        const allMovies = [...nowPlaying, ...upcoming];
        setMovies(allMovies);
        setFilteredMovies(allMovies);
        setCurrentPage(1);
        setHasMoreAPI(nowPlaying.length > 0 || upcoming.length > 0);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch favorites from DB
  useEffect(() => {
    const fetchFavorites = async () => {
      if (token) {
        try {
          const data = await getFavorites(token);
          if (data && data.favorites) {
            setFavoriteIds(data.favorites);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      } else {
        setFavoriteIds([]);
      }
    };
    fetchFavorites();
  }, [token]);

  // Fetch bookings and calculate top genres for recommendations
  useEffect(() => {
    const fetchTopGenres = async () => {
      if (!token) {
        setTopGenres([]);
        return;
      }
      try {
        const bookings = await getMyBookings(token);

        let bookedMovieIds = [];
        if (bookings && Array.isArray(bookings)) {
          bookings.forEach(b => {
            if (b.showtime?.movie?.id) bookedMovieIds.push(b.showtime.movie.id);
            else if (b.showtime?.movie?.tmdbId) bookedMovieIds.push(b.showtime.movie.tmdbId);
            else if (b.movie?.id) bookedMovieIds.push(b.movie.id);
          });
        }

        // Chỉ dùng các ID phim từ vé đã mua để gợi ý
        const interestedIds = bookedMovieIds.map(Number);

        const genreCounts = {};
        interestedIds.forEach(id => {
          const m = movies.find(movie => movie.id === id);
          if (m && m.genre_ids) {
            m.genre_ids.forEach(gId => {
              genreCounts[gId] = (genreCounts[gId] || 0) + 1;
            });
          }
        });

        const sortedGenres = Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
          .map(entry => Number(entry[0]));

        setTopGenres(sortedGenres);
      } catch (err) {
        console.error("Error fetching bookings for recommendations:", err);
      }
    };

    if (movies.length > 0) {
      fetchTopGenres();
    }
  }, [token, favoriteIds, movies]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedStatus, selectedGenre, minYear, maxYear, selectedRating, selectedRuntime]);

  // Auto apply filters when filters change
  useEffect(() => {
    let baseMovies = movies;
    if (selectedStatus === "Yêu thích") {
      baseMovies = movies.filter(movie => favoriteIds.includes(movie.id));
    }

    const now = new Date();

    const filtered = baseMovies.filter((movie) => {
      const releaseDate = new Date(movie.release_date);
      const releaseYear = releaseDate.getFullYear();

      if (selectedStatus === "Đang chiếu" && releaseDate > now) return false;
      if (selectedStatus === "Sắp chiếu" && releaseDate <= now) return false;

      if (selectedGenre !== "all" && !movie.genre_ids?.includes(parseInt(selectedGenre))) {
        return false;
      }

      // Advanced Filters
      if (minYear && releaseYear < parseInt(minYear)) return false;
      if (maxYear && releaseYear > parseInt(maxYear)) return false;
      if (selectedRating > 0 && (movie.vote_average || 0) < selectedRating) return false;

      if (selectedRuntime !== "all") {
        // API TMDB không trả về runtime ở list, ta tạo giả lập (mock) dựa trên ID để test logic lọc
        const r = movie.runtime || (85 + (movie.id % 50));

        if (selectedRuntime === "short" && r >= 90) return false;
        if (selectedRuntime === "medium" && (r < 90 || r > 120)) return false;
        if (selectedRuntime === "long" && r <= 120) return false;
      }

      return true;
    });

    // Recommendation Sorting for "Có thể bạn thích"
    if (selectedStatus === "Có thể bạn thích") {
      if (topGenres.length > 0) {
        filtered.sort((a, b) => {
          const scoreA = a.genre_ids?.reduce((sum, g) => sum + (topGenres.includes(g) ? (topGenres.length - topGenres.indexOf(g)) : 0), 0) || 0;
          const scoreB = b.genre_ids?.reduce((sum, g) => sum + (topGenres.includes(g) ? (topGenres.length - topGenres.indexOf(g)) : 0), 0) || 0;
          return scoreB - scoreA;
        });
      } else {
        filtered.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      }
    }

    setFilteredMovies(filtered);
  }, [selectedStatus, selectedGenre, minYear, maxYear, selectedRating, selectedRuntime, movies, favoriteIds, topGenres]);

  // reset filter
  const resetFilters = () => {
    setSelectedStatus("Đang chiếu");
    setSelectedGenre("all");
    setMinYear("");
    setMaxYear(2026);
    setSelectedRating(0);
    setSelectedRuntime("all");
    setVisibleCount(20);
  };

  const handleToggleFavorite = async (e, movie) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Vui lòng đăng nhập để lưu phim yêu thích.");
      return;
    }

    try {
      // Optimistic update
      const isFav = favoriteIds.includes(movie.id);
      setFavoriteIds(prev =>
        isFav ? prev.filter(id => id !== movie.id) : [...prev, movie.id]
      );

      const data = await toggleFavorite(movie.id, token);
      if (data && typeof data.added === "boolean") {
        // Sync with actual state from server if we want to be exact,
        // but optimistic is usually enough unless it errors
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert optimistic update
      const isFav = favoriteIds.includes(movie.id);
      setFavoriteIds(prev =>
        !isFav ? prev.filter(id => id !== movie.id) : [...prev, movie.id]
      );
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleLoadMore = async () => {
    const nextCount = visibleCount + 10;

    if (selectedStatus !== "Yêu thích" && selectedStatus !== "Có thể bạn thích" && nextCount > filteredMovies.length && hasMoreAPI) {
      const nextPage = currentPage + 1;
      setLoadingMore(true);
      try {
        const nowPlaying = await getNowPlayingMovies(nextPage);
        const upcoming = await getUpcomingMovies(nextPage);
        const allNewMovies = [...nowPlaying, ...upcoming];

        if (nowPlaying.length === 0 && upcoming.length === 0) {
          setHasMoreAPI(false);
        } else {
          const newUnique = allNewMovies.filter(
            newMovie => !movies.some(existing => existing.id === newMovie.id)
          );
          setMovies(prev => [...prev, ...newUnique]);
          setCurrentPage(nextPage);
        }
      } catch (error) {
        console.error("Error fetching more movies:", error);
      } finally {
        setLoadingMore(false);
      }
    }

    setVisibleCount(nextCount);
  };

  const genres = [
    { id: "all", name: "Tất cả", icon: "🎬" },
    { id: "28", name: "Hành động", icon: "⚡" },
    { id: "12", name: "Phiêu lưu", icon: "🗺️" },
    { id: "16", name: "Hoạt hình", icon: "🐭" },
    { id: "35", name: "Hài", icon: "😂" },
    { id: "18", name: "Chính kịch", icon: "🎭" },
    { id: "27", name: "Kinh dị", icon: "👻" },
    { id: "10749", name: "Tình cảm", icon: "💕" },
    { id: "878", name: "Viễn tưởng", icon: "🚀" },
  ];

  // ── Theme helpers ──
  const pageBg     = isDark ? "bg-gradient-to-b from-gray-900 to-black" : "bg-gray-50";
  const filterBg   = isDark ? "bg-black/90 border-yellow-500/30" : "bg-white/95 border-gray-200 shadow-sm";
  const inactivBtn = isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200";
  const genreBtn   = isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200";
  const countText  = isDark ? "text-gray-400" : "text-gray-500";
  const emptyTitle = isDark ? "text-white" : "text-gray-900";
  const emptyText  = isDark ? "text-gray-400" : "text-gray-500";
  const cardBg     = isDark ? "bg-gradient-to-b from-gray-800 to-gray-900" : "bg-white border border-gray-200";
  const cardTitle  = isDark ? "text-white group-hover:text-yellow-400" : "text-gray-900 group-hover:text-yellow-600";
  const cardMeta   = isDark ? "text-gray-400" : "text-gray-500";

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4" />
          <p className={`text-lg ${isDark ? "text-white" : "text-gray-700"}`}>Đang tải phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>

      {/* VIDEO HERO SECTION */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <video src={video} className="w-full h-full object-cover" autoPlay muted loop playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="absolute bottom-10 left-0 right-0 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 animate-fadeInUp">
            PHIM HAY TẠI RẠP
          </h1>
          <p className="text-gray-300 text-lg animate-fadeInUp animation-delay-200">
            KHÁM PHÁ NHANH THÔI
          </p>
        </div>
      </div>

      {/* FILTER SECTION */}
      <section className={`sticky top-0 z-20 backdrop-blur-md border-b py-4 shadow-lg ${filterBg}`}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
            {["Đang chiếu", "Sắp chiếu", "Yêu thích", "Có thể bạn thích"].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-yellow-500 to-red-500 text-black shadow-lg transform scale-105"
                    : inactivBtn
                }`}
              >
                {status === "Đang chiếu" && "🎬 "}
                {status === "Sắp chiếu"  && "⏰ "}
                {status === "Yêu thích"  && "❤️ "}
                {status === "Có thể bạn thích" && "✨ "}
                {status}
              </button>
            ))}
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-sm mr-2 ${countText}`}>🎭 Thể loại:</span>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  selectedGenre === genre.id
                    ? "bg-yellow-500 text-black font-semibold shadow-md"
                    : genreBtn
                }`}
              >
                {genre.icon} {genre.name}
              </button>
            ))}
            <button
              onClick={resetFilters}
              className="ml-auto px-4 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full text-sm transition-all duration-300 flex items-center gap-1"
            >
              🔄 Reset
            </button>
          </div>

          <div className={`mt-4 text-sm ${countText}`}>
            Tìm thấy <span className="text-yellow-500 font-bold">{Math.min(filteredMovies.length, visibleCount)}</span> phim đang hiển thị
          </div>
        </div>
      </section>

      {/* MOVIE GRID */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {filteredMovies.length === 0 ? (
          selectedStatus === "Yêu thích" ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🤍</div>
              <h3 className={`text-2xl font-bold mb-2 ${emptyTitle}`}>Chưa có phim yêu thích</h3>
              <p className={emptyText}>Bạn chưa yêu thích phim nào. Nhấn ❤️ trên poster để thêm!</p>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className={`text-2xl font-bold mb-2 ${emptyTitle}`}>Không tìm thấy phim</h3>
              <p className={`mb-4 ${emptyText}`}>Hãy thử chọn thể loại hoặc trạng thái khác nhé!</p>
              <button onClick={resetFilters} className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition">
                Đặt lại bộ lọc
              </button>
            </div>
          )
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.slice(0, visibleCount).map((movie) => {
                const releaseDate = new Date(movie.release_date);
                const now = new Date();
                const isUpcoming = releaseDate > now;
                const formattedDate = releaseDate.toLocaleDateString("vi-VN");
                const displayRuntime = movie.runtime || (85 + (movie.id % 50));
                return (
                  <Link to={`/movie/${movie.id}`} key={movie.id}>
                    <div className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer ${cardBg}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={movie.poster_path ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
                          alt={movie.title}
                          className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {isUpcoming ? (
                          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">🎬 Sắp chiếu</div>
                        ) : (
                          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">🔥 Đang chiếu</div>
                        )}
                        <button onClick={(e) => handleToggleFavorite(e, movie)} className="absolute top-3 right-3 z-20 text-xl transition-transform duration-200 hover:scale-125 drop-shadow-md">
                          {favoriteIds.includes(movie.id) ? "❤️" : "🤍"}
                        </button>
                        {movie.vote_average > 0 && (
                          <div className="absolute top-3 right-12 z-10 bg-black/80 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <span>⭐</span><span>{movie.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                          <button className="bg-gradient-to-r from-yellow-500 to-red-500 text-black px-6 py-2.5 rounded-full font-bold text-sm transform hover:scale-105 transition duration-300 shadow-lg">
                            {isUpcoming ? "ĐẶT VÉ TRƯỚC" : "ĐẶT VÉ NGAY"}
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className={`text-sm font-bold line-clamp-2 mb-2 transition-colors text-center ${cardTitle}`}>{movie.title}</h3>
                        <div className={`flex items-center justify-center gap-2 text-xs ${cardMeta}`}>
                          <span>{releaseDate.getFullYear()}</span>
                          <span>•</span>
                          <span>{displayRuntime} phút</span>
                        </div>
                        {isUpcoming && (
                          <p className="text-xs text-yellow-400 text-center mt-2 font-semibold">Khởi chiếu: {formattedDate}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {((selectedStatus !== "Yêu thích" && selectedStatus !== "Có thể bạn thích" && (visibleCount < filteredMovies.length || hasMoreAPI)) ||
              ((selectedStatus === "Yêu thích" || selectedStatus === "Có thể bạn thích") && visibleCount < filteredMovies.length)) && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className={`border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 transform bg-transparent ${loadingMore ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                >
                  {loadingMore ? "Đang tải..." : "Xem thêm phim"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Movie;