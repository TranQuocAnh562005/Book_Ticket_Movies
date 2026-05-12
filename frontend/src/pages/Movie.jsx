import { useEffect, useState } from "react";
import {
  getNowPlayingMovies,
  getUpcomingMovies,
} from "../services/movies";
import { Link } from "react-router-dom";
import video from "../assets/Tạo_Video_Giới_Thiệu_Kết_Thúc.mp4";
import { useAuth } from "../context/AuthContext";
import { getFavorites, toggleFavorite } from "../services/favorites";
import { getMyBookings } from "../services/bookings";

function Movie() {
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

  const MovieCard = ({ movie }) => {
    const releaseDate = new Date(movie.release_date);
    const now = new Date();
    const isUpcoming = releaseDate > now;
    const formattedDate = releaseDate.toLocaleDateString("vi-VN");
    // Giả lập runtime nếu API không có để hiển thị đồng bộ với bộ lọc
    const displayRuntime = movie.runtime || (85 + (movie.id % 50));

    return (
      <Link to={`/movie/${movie.id}`}>
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">

          {/* Poster Container */}
          <div className="relative overflow-hidden">
            <img
              src={
                movie.poster_path
                  ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Status Badge */}
            {isUpcoming ? (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">
                🎬 Sắp chiếu
              </div>
            ) : (
              <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                🔥 Đang chiếu
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => handleToggleFavorite(e, movie)}
              className="absolute top-3 right-3 z-20 text-xl transition-transform duration-200 hover:scale-125 drop-shadow-md"
            >
              {favoriteIds.includes(movie.id) ? "❤️" : "🤍"}
            </button>

            {/* Rating Badge */}
            {movie.vote_average > 0 && (
              <div className="absolute top-3 right-12 z-10 bg-black/80 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <span>⭐</span>
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            )}

            {/* Hover Action Button */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <button className="bg-gradient-to-r from-yellow-500 to-red-500 text-black px-6 py-2.5 rounded-full font-bold text-sm transform hover:scale-105 transition duration-300 shadow-lg">
                {isUpcoming ? "ĐẶT VÉ TRƯỚC" : "ĐẶT VÉ NGAY"}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-yellow-400 transition-colors text-center">
              {movie.title}
            </h3>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>{releaseDate.getFullYear()}</span>
              <span>•</span>
              <span>{displayRuntime} phút</span>
            </div>

            {isUpcoming && (
              <p className="text-xs text-yellow-400 text-center mt-2 font-semibold">
                Khởi chiếu: {formattedDate}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">

      {/* VIDEO HERO SECTION */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <video
          src={video}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* Hero Text */}
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
      <section className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-yellow-500/30 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">

          {/* Status Tabs */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSelectedStatus("Đang chiếu")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedStatus === "Đang chiếu"
                ? "bg-gradient-to-r from-yellow-500 to-red-500 text-black shadow-lg transform scale-105"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              🎬 Đang chiếu
            </button>
            <button
              onClick={() => setSelectedStatus("Sắp chiếu")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedStatus === "Sắp chiếu"
                ? "bg-gradient-to-r from-yellow-500 to-red-500 text-black shadow-lg transform scale-105"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              ⏰ Sắp chiếu
            </button>
            <button
              onClick={() => setSelectedStatus("Yêu thích")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedStatus === "Yêu thích"
                  ? "bg-gradient-to-r from-yellow-500 to-red-500 text-black shadow-lg transform scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              ❤️ Yêu thích
            </button>
            <button
              onClick={() => setSelectedStatus("Có thể bạn thích")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedStatus === "Có thể bạn thích"
                  ? "bg-gradient-to-r from-yellow-500 to-red-500 text-black shadow-lg transform scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              ✨ Có thể bạn thích
            </button>
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-gray-400 text-sm mr-2">🎭 Thể loại:</span>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${selectedGenre === genre.id
                  ? "bg-yellow-500 text-black font-semibold shadow-md"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
              >
                {genre.icon} {genre.name}
              </button>
            ))}

            <button
              onClick={resetFilters}
              className="ml-auto px-4 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full text-sm transition-all duration-300 flex items-center gap-1"
            >
              <span>🔄</span> Reset
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-6 items-center mt-4 border-t border-gray-700/50 pt-4">
            
            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">📅 Năm:</span>
              <input 
                type="number" 
                placeholder="Từ năm"
                value={minYear} 
                onChange={(e) => setMinYear(e.target.value)}
                className="w-24 bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-yellow-500"
              />
              <span className="text-gray-400 font-bold">-</span>
              <input 
                type="number" 
                placeholder="Đến năm"
                value={maxYear} 
                onChange={(e) => setMaxYear(e.target.value)}
                className="w-24 bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">⭐ Điểm:</span>
              <select 
                value={selectedRating} 
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
              >
                <option value={0}>Tất cả</option>
                <option value={7}>≥ 7.0</option>
                <option value={8}>≥ 8.0</option>
                <option value={9}>≥ 9.0</option>
              </select>
            </div>

            {/* Runtime Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">⏱️ Thời lượng:</span>
              <select 
                value={selectedRuntime} 
                onChange={(e) => setSelectedRuntime(e.target.value)}
                className="bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
              >
                <option value="all">Tất cả</option>
                <option value="short">Ngắn ({"<"} 90 phút)</option>
                <option value="medium">Vừa (90 - 120 phút)</option>
                <option value="long">Dài ({">"} 120 phút)</option>
              </select>
            </div>

          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
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
              <h3 className="text-2xl font-bold text-white mb-2">Chưa có phim yêu thích</h3>
              <p className="text-gray-400">Bạn chưa yêu thích phim nào. Nhấn ❤️ trên poster để thêm!</p>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy phim</h3>
              <p className="text-gray-400">Hãy thử chọn thể loại hoặc trạng thái khác nhé!</p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.slice(0, visibleCount).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Load More Button */}
            {((selectedStatus !== "Yêu thích" && selectedStatus !== "Có thể bạn thích" && (visibleCount < filteredMovies.length || hasMoreAPI)) ||
              ((selectedStatus === "Yêu thích" || selectedStatus === "Có thể bạn thích") && visibleCount < filteredMovies.length)) && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className={`bg-transparent border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 transform ${loadingMore ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
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