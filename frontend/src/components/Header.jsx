import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { searchMovies } from "../utils/searchMovies";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const { user, isLoggedIn } = useAuth();
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (search.length < 2) { setResults([]); return; }
      const data = await searchMovies(search);
      setResults(data.slice(0, 6));
    };
    const debounce = setTimeout(fetchMovies, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleSearch = (e) => { setSearch(e.target.value); setIsSearchOpen(true); };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setSearch(""); setResults([]); setIsSearchOpen(false);
  };

  const navItems = [
    { path: "/",      name: "Trang chủ" },
    { path: "/movie", name: "Phim" },
    { path: "/news",  name: "Tin điện ảnh" },
    { path: "/ticket",name: "Vé của tôi" },
  ];

  // ── Theme-aware class helpers ──
  const headerBg = scrolled
    ? isDark
      ? "bg-black/95 backdrop-blur-md shadow-2xl border-b border-yellow-500/30"
      : "bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-yellow-400"
    : isDark
      ? "bg-gradient-to-b from-black/80 to-transparent border-b border-yellow-500/20"
      : "bg-white/90 backdrop-blur-sm border-b-2 border-yellow-400/40";

  const navLinkCls = isDark
    ? "text-gray-300 hover:text-yellow-400"
    : "text-gray-600 hover:text-yellow-600";

  const searchInputCls = isDark
    ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-500 focus:bg-black/50"
    : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:bg-white";

  const dropdownBg = isDark
    ? "bg-gradient-to-b from-gray-900 to-black border-gray-700"
    : "bg-white border-gray-200 shadow-xl";

  const dropdownItemCls = isDark
    ? "hover:bg-white/10"
    : "hover:bg-gray-50";

  const mobileMenuBg = isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200";
  const mobileMenuText = isDark ? "text-white" : "text-gray-800";
  const mobileMenuBtn = isDark ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src={logo} className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110" alt="Logo" />
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300
                              ${isDark
                                ? "from-white to-yellow-400 group-hover:from-yellow-400 group-hover:to-white"
                                : "from-gray-900 to-yellow-600 group-hover:from-yellow-600 group-hover:to-gray-900"
                              }`}>
              TicketFlix
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 font-medium transition-colors duration-300 group ${navLinkCls}`}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-red-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* SEARCH BAR */}
            <div ref={searchRef} className="hidden md:block relative">
              <div className={`relative transition-all duration-300 ${isSearchOpen ? "w-80" : "w-64"}`}>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Tìm phim..."
                  className={`w-full backdrop-blur-sm border rounded-full px-4 py-2 pl-10 text-sm
                              focus:outline-none transition-all duration-300 ${searchInputCls}`}
                />
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-400"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* SEARCH RESULTS */}
              {isSearchOpen && results.length > 0 && (
                <div className={`absolute top-full mt-2 right-0 w-96 rounded-2xl overflow-hidden animate-fadeInDown z-50 border ${dropdownBg}`}>
                  <div className={`p-2 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                    <p className={`text-xs px-3 py-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>🎬 Kết quả tìm kiếm</p>
                  </div>
                  {results.map((movie, index) => (
                    <div
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id)}
                      className={`flex gap-3 p-3 cursor-pointer transition-all duration-300 group animate-slideIn ${dropdownItemCls}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <img
                        src={movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                          : "https://via.placeholder.com/80x120?text=No+Image"
                        }
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold group-hover:text-yellow-400 transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                          {movie.title}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {movie.release_date?.split('-')[0] || "Sắp chiếu"}
                        </p>
                        {movie.vote_average > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-xs">⭐</span>
                            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{movie.vote_average.toFixed(1)}/10</span>
                          </div>
                        )}
                      </div>
                      <div className={`group-hover:text-yellow-400 transition-colors ${isDark ? "text-gray-500" : "text-gray-400"}`}>→</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* THEME TOGGLE */}
            <ThemeToggle size="md" />

            {/* USER MENU */}
            <div className="relative hidden md:block">
              {isLoggedIn ? (
                <Link to="/profile" className="flex items-center gap-2.5 group">
                  <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-0.5 rounded-full
                                  group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-yellow-400 font-bold text-sm">
                          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-medium transition-colors max-w-[100px] truncate group-hover:text-yellow-400
                                    ${isDark ? "text-white/90" : "text-gray-700"}`}>
                    {user?.fullName?.split(" ").slice(-1)[0] || user?.email?.split("@")[0]}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/account"
                  className="px-4 py-2 rounded-full border border-yellow-500/50 text-yellow-500
                             hover:bg-yellow-500/10 font-medium text-sm transition-all duration-300
                             hover:border-yellow-400 whitespace-nowrap"
                >
                  Đăng nhập / Đăng ký
                </Link>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${mobileMenuBtn}`}
            >
              <svg className={`w-6 h-6 ${isDark ? "text-white" : "text-gray-700"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-slideDown">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${mobileMenuBg}`}
              >
                <span className={`font-medium group-hover:text-yellow-400 transition-colors ${mobileMenuText}`}>{item.name}</span>
              </Link>
            ))}

            {/* Theme Toggle in mobile */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${mobileMenuBg}`}>
              <span className={`font-medium ${mobileMenuText}`}>Chế độ hiển thị</span>
              <ThemeToggle size="sm" showLabel />
            </div>

            {/* Mobile Auth */}
            <Link
              to={isLoggedIn ? "/profile" : "/account"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all duration-300"
            >
              <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                {isLoggedIn ? "Tài khoản" : "Đăng nhập / Đăng ký"}
              </span>
            </Link>

            {/* Mobile Search */}
            <div className="px-4 pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Tìm phim..."
                  className={`w-full border rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-yellow-500 ${searchInputCls}`}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
