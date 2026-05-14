import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import { getNowPlayingMovies, getUpcomingMovies } from "../services/movies";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const { isDark } = useTheme();
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [nowPlayingRes, upcomingRes] = await Promise.all([
          getNowPlayingMovies(1),
          getUpcomingMovies(1),
        ]);
        setNowPlaying(nowPlayingRes.slice(0, 5));
        setUpcoming(upcomingRes.slice(0, 5));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const card       = isDark ? "bg-gradient-to-b from-gray-800 to-gray-900" : "bg-white border border-gray-200 shadow-sm";
  const cardTitle  = isDark ? "text-white group-hover:text-yellow-400" : "text-gray-900 group-hover:text-yellow-600";
  const cardMeta   = isDark ? "text-gray-400" : "text-gray-500";
  const sectionBg  = isDark ? "from-gray-900 to-black" : "from-gray-50 to-white";
  const heading    = isDark ? "from-white to-gray-400" : "from-gray-900 to-gray-600";
  const promo      = isDark ? "from-purple-900/50 to-pink-900/50" : "from-purple-100 to-pink-100";
  const promoText  = isDark ? "text-white" : "text-gray-900";
  const promoSub   = isDark ? "text-gray-300" : "text-gray-600";
  const promoDate  = isDark ? "text-white" : "text-gray-700";

  const MovieCard = ({ movie, type }) => (
    <Link to={`/movie/${movie.id}`}>
      <div className={`group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${card}`}>
        {/* Status Badge */}
        {type === "upcoming" && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
            🎬 Sắp chiếu
          </div>
        )}
        {type === "now" && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
            🔥 Đang chiếu
          </div>
        )}

        {/* Rating */}
        {movie.vote_average > 0 && (
          <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded-full font-bold">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Poster */}
        <div className="relative overflow-hidden">
          <img
            src={movie.poster_path
              ? `${import.meta.env.VITE_IMG_URL}${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className={`text-sm font-bold line-clamp-2 mb-2 transition-colors ${cardTitle}`}>
            {movie.title}
          </h3>
          <div className={`flex items-center justify-between text-xs ${cardMeta}`}>
            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
            <span className="text-yellow-500 font-semibold">Đặt vé →</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm transform hover:scale-105 transition duration-300">
            {type === "now" ? "ĐẶT VÉ NGAY" : "ĐẶT VÉ TRƯỚC"}
          </button>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${sectionBg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4" />
          <p className={`text-lg ${isDark ? "text-white" : "text-gray-700"}`}>Đang tải phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${sectionBg} transition-colors duration-300`}>
      <Banner />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* PHIM ĐANG CHIẾU */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎬</span>
              <h2 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${heading} bg-clip-text text-transparent`}>
                Phim đang chiếu
              </h2>
            </div>
            <Link
              to="/movie"
              state={{ filterStatus: "Đang chiếu" }}
              className="text-yellow-500 hover:text-yellow-400 transition-colors text-sm flex items-center gap-1 group"
            >
              Xem tất cả
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {nowPlaying.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="now" />
            ))}
          </div>
        </div>

        {/* PHIM SẮP CHIẾU */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏰</span>
              <h2 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${heading} bg-clip-text text-transparent`}>
                Phim sắp chiếu
              </h2>
            </div>
            <Link
              to="/movie"
              state={{ filterStatus: "Sắp chiếu" }}
              className="text-yellow-500 hover:text-yellow-400 transition-colors text-sm flex items-center gap-1 group"
            >
              Xem tất cả
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {upcoming.map((movie) => (
              <MovieCard key={movie.id} movie={movie} type="upcoming" />
            ))}
          </div>
        </div>

        {/* ƯU ĐÃI ĐẶC BIỆT */}
        <div className={`mt-12 bg-gradient-to-r ${promo} rounded-2xl p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-4 ${promoText}`}>🎫 Ưu đãi đặc biệt</h2>
              <p className={`mb-6 ${promoSub}`}>
                Đặt vé ngay hôm nay để nhận ưu đãi lên đến 50% cho các suất chiếu sớm!
              </p>
              <Link
                to="/movie"
                className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition transform hover:scale-105"
              >
                Đặt vé ngay
              </Link>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2 animate-bounce">🎬</div>
              <p className={`text-sm ${promoDate}`}>Áp dụng đến 31/12/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
