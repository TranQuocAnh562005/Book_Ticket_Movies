import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieCredits } from "../services/movies";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getFavorites, toggleFavorite } from "../services/favorites";
import CommentSection from "../components/CommentSection";

function MovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark } = useTheme();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      try {
        const [movieRes, trailerRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_API_KEY}&language=vi-VN`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_API_KEY}`),
          getMovieCredits(id),
        ]);
        const movieData  = await movieRes.json();
        const trailerData = await trailerRes.json();
        setMovie(movieData);
        setCredits(creditsRes);
        const yt = trailerData.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (yt) setTrailer(yt.key);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      if (token && id) {
        try {
          const data = await getFavorites(token);
          if (data?.favorites?.includes(Number(id))) setIsFavorite(true);
        } catch (error) {
          console.error("Error fetching favorite status:", error);
        }
      }
    };

    fetchMovieData();
    checkFavoriteStatus();
  }, [id, token]);

  const handleToggleFavorite = async () => {
    if (!token) { navigate("/account"); return; }
    try {
      setIsFavorite(!isFavorite);
      const data = await toggleFavorite(Number(id), token);
      if (data && typeof data.added === "boolean") setIsFavorite(data.added);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFavorite(isFavorite);
    }
  };

  const director   = credits?.crew?.find(m => m.job === "Director")?.name || "Đang cập nhật";
  const writers    = credits?.crew?.filter(m => ["Screenplay","Writer","Story"].includes(m.job)).slice(0, 3);
  const mainCast   = credits?.cast?.slice(0, 10) || [];

  const formatRuntime = (minutes) => {
    if (!minutes) return "Chưa cập nhật";
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return h === 0 ? `${m} phút` : `${h} giờ ${m} phút`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Chưa cập nhật";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // ── Theme helpers ──
  const pageBg  = isDark ? "bg-gradient-to-b from-gray-900 to-black" : "bg-gray-50";
  const card    = isDark ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200 shadow-sm";
  const cardTxt = isDark ? "text-white" : "text-gray-900";
  const muteTxt = isDark ? "text-gray-300" : "text-gray-600";
  const dimTxt  = isDark ? "text-gray-500" : "text-gray-500";
  const badge   = isDark ? "bg-gray-800/50" : "bg-gray-100 border border-gray-200";
  const tabBdr  = isDark ? "border-gray-700" : "border-gray-200";
  const actorBg = isDark ? "bg-gray-700/30 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100 border border-gray-200";
  const genrePill = isDark ? "bg-gray-800 text-gray-300 hover:bg-yellow-500 hover:text-black" : "bg-gray-100 text-gray-600 hover:bg-yellow-400 hover:text-black border border-gray-200";

  if (isLoading) {
    return (
      <div className={`min-h-screen ${pageBg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4" />
          <p className={`text-lg ${cardTxt}`}>Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>

      {/* BACKDROP BANNER */}
      <div
        className="relative h-[550px] bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        {trailer && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setShowTrailer(true)}
              className="group relative w-28 h-28 rounded-full bg-black/30 backdrop-blur-sm hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 border-2 border-white/30"
            >
              <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <span className="text-5xl text-white group-hover:text-black transition-colors">▶</span>
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-28 pb-16">
        <div className="flex flex-col md:flex-row gap-8">

          {/* POSTER + ACTIONS */}
          <div className="md:w-72 shrink-0">
            <img
              src={`${import.meta.env.VITE_IMG_URL}${movie.poster_path}`}
              alt={movie.title}
              className={`w-full rounded-xl shadow-2xl ${isDark ? "border border-gray-700" : "border border-gray-200"}`}
            />
            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate(`/movie/ticketbooking/${movie.id}`)}
                className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-black font-bold py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm"
              >
                🎫 ĐẶT VÉ NGAY
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`w-full font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                  isDark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
                }`}
              >
                {isFavorite ? "❤️ Đã thích" : "🤍 Thêm vào yêu thích"}
              </button>
            </div>
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${cardTxt}`}>{movie.title}</h1>
            {movie.original_title !== movie.title && (
              <p className={`text-sm mb-3 ${dimTxt}`}>{movie.original_title}</p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full">
                <span className="text-yellow-400">⭐</span>
                <span className={`font-bold text-sm ${cardTxt}`}>{movie.vote_average?.toFixed(1)}</span>
                <span className={`text-xs ${dimTxt}`}>/10</span>
              </div>
              <div className={`text-xs px-3 py-1 rounded-full ${badge} ${muteTxt}`}>
                📅 {new Date(movie.release_date).getFullYear()}
              </div>
              <div className={`text-xs px-3 py-1 rounded-full ${badge} ${muteTxt}`}>
                ⏱️ {formatRuntime(movie.runtime)}
              </div>
              <div className={`text-xs px-3 py-1 rounded-full ${badge} ${muteTxt}`}>
                🎬 {movie.status === "Released" ? "Đang chiếu" : "Sắp chiếu"}
              </div>
            </div>

            {/* Genres */}
            <div className="flex gap-2 flex-wrap mb-5">
              {movie.genres?.slice(0, 5).map(g => (
                <span key={g.id} className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-colors ${genrePill}`}>
                  {g.name}
                </span>
              ))}
            </div>

            {/* TABS */}
            <div className={`border-b ${tabBdr} mb-5`}>
              <div className="flex gap-5">
                {["overview", "cast", "comments"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 px-1 font-semibold transition-all duration-300 relative text-sm ${
                      activeTab === tab ? "text-yellow-500" : isDark ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-800"
                    }`}
                  >
                    {tab === "overview"  && "📖 Tổng quan"}
                    {tab === "cast"      && "🎭 Diễn viên"}
                    {tab === "comments"  && "💬 Bình luận"}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div className={`rounded-xl p-5 ${card}`}>
                <h3 className={`text-base font-semibold mb-2 ${cardTxt}`}>Nội dung phim</h3>
                <p className={`leading-relaxed text-sm ${muteTxt}`}>
                  {showFullOverview ? movie.overview : movie.overview?.slice(0, 350)}
                  {movie.overview?.length > 350 && (
                    <button
                      onClick={() => setShowFullOverview(!showFullOverview)}
                      className="text-yellow-500 hover:text-yellow-400 ml-2 text-xs"
                    >
                      {showFullOverview ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </p>

                <div className={`grid grid-cols-2 gap-4 mt-5 pt-5 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  {[
                    { label: "ĐẠO DIỄN",  value: director },
                    writers?.length > 0 ? { label: "BIÊN KỊCH", value: writers.map(w => w.name).join(", ") } : null,
                    { label: "THỜI LƯỢNG", value: formatRuntime(movie.runtime) },
                    { label: "NGÔN NGỮ",   value: movie.spoken_languages?.map(l => l.english_name).slice(0, 2).join(", ") || "Đang cập nhật" },
                    { label: "QUỐC GIA",   value: movie.production_countries?.map(c => c.name).slice(0, 2).join(", ") || "Đang cập nhật" },
                    { label: "NGÂN SÁCH",  value: formatCurrency(movie.budget) },
                    { label: "DOANH THU",  value: formatCurrency(movie.revenue) },
                  ].filter(Boolean).map(({ label, value }) => (
                    <div key={label}>
                      <p className={`text-xs mb-1 ${dimTxt}`}>{label}</p>
                      <p className={`text-sm ${cardTxt}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CAST TAB ── */}
            {activeTab === "cast" && (
              <div className="space-y-5">
                <div className={`rounded-xl p-5 ${card}`}>
                  <h3 className="text-sm font-semibold text-yellow-500 mb-3">🎬 ĐẠO DIỄN</h3>
                  <div className={`flex items-center gap-3 rounded-lg p-3 ${actorBg}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>🎥</div>
                    <div>
                      <p className={`font-medium text-sm ${cardTxt}`}>{director}</p>
                      <p className={`text-xs ${dimTxt}`}>Director</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-5 ${card}`}>
                  <h3 className="text-sm font-semibold text-yellow-500 mb-3">⭐ DIỄN VIÊN CHÍNH</h3>
                  {mainCast.length === 0 ? (
                    <p className={`text-sm text-center py-6 ${dimTxt}`}>Đang cập nhật...</p>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {mainCast.map(actor => (
                        <div key={actor.cast_id} className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${actorBg}`}>
                          {actor.profile_path ? (
                            <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>🎭</div>
                          )}
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${cardTxt}`}>{actor.name}</p>
                            <p className={`text-xs ${dimTxt}`}>vai {actor.character || "..."}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── COMMENTS TAB ── */}
            {activeTab === "comments" && (
              <div className={`rounded-xl p-5 ${card}`}>
                <CommentSection id={id} type="movie" withRating />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-[95%] max-w-6xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white text-xl flex items-center justify-center transition-all duration-300"
            >
              ✕
            </button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailer}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                title="Movie Trailer"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-semibold">{movie?.title}</p>
              <p className="text-gray-300 text-sm">Trailer chính thức</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
