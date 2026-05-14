import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Eye, ChevronDown, X, TrendingUp, Newspaper, Filter } from "lucide-react";
import { filterNews, getCategories, getFeaturedNews, formatDate, formatViews } from "../services/newsService";

const CATEGORY_COLORS = {
  "Tin tức":       "bg-blue-500/20   text-blue-300   border-blue-400/30",
  "Review":        "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  "Công nghệ":     "bg-purple-500/20 text-purple-300 border-purple-400/30",
  "Phỏng vấn":     "bg-green-500/20  text-green-300  border-green-400/30",
  "Hậu trường":    "bg-orange-500/20 text-orange-300 border-orange-400/30",
  "Điện ảnh Việt": "bg-red-500/20    text-red-300    border-red-400/30",
};

const SORT_OPTIONS = [
  { value: "newest",  label: "Mới nhất" },
  { value: "popular", label: "Phổ biến nhất" },
  { value: "oldest",  label: "Cũ nhất" },
  { value: "quick",   label: "Đọc nhanh" },
];

function CategoryBadge({ category, small }) {
  const cls = CATEGORY_COLORS[category] || "bg-gray-500/20 text-gray-300 border-gray-400/30";
  return (
    <span className={`inline-flex items-center border rounded-full font-semibold ${small ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"} ${cls}`}>
      {category}
    </span>
  );
}

function FeaturedCard({ article, large }) {
  return (
    <Link to={`/news/${article.id}`} className="group block h-full">
      <div className={`relative h-full overflow-hidden rounded-2xl ${large ? "min-h-[420px]" : "min-h-[195px]"}`}>
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className={`absolute bottom-0 left-0 right-0 ${large ? "p-6" : "p-4"}`}>
          <CategoryBadge category={article.category} small={!large} />
          <h3 className={`mt-2 font-bold text-white leading-snug group-hover:text-yellow-300 transition-colors ${large ? "text-2xl" : "text-base line-clamp-2"}`}>
            {article.title}
          </h3>
          {large && (
            <p className="mt-2 text-sm text-gray-300 line-clamp-2">{article.summary}</p>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime} phút đọc</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(article.views)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article, index }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/news/${article.id}`}
        className="group flex flex-col h-full bg-white dark:bg-white/5 rounded-2xl overflow-hidden
                   border border-gray-200 dark:border-white/10
                   hover:border-yellow-400/60 dark:hover:border-yellow-400/40
                   hover:shadow-lg hover:shadow-yellow-400/10
                   transition-all duration-300"
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-video flex-shrink-0">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <CategoryBadge category={article.category} small />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2
                         group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 mb-4">
            {article.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full
                                         bg-gray-100 dark:bg-white/5
                                         text-gray-500 dark:text-gray-400
                                         border border-gray-200 dark:border-white/10">
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[100px]">
                {article.author}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />{article.readTime}p
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />{formatViews(article.views)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Motion.div>
  );
}

export default function CinemaNews() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort]         = useState("newest");
  const [showFilter, setShowFilter] = useState(false);

  const categories = useMemo(() => getCategories(), []);
  const featured   = useMemo(() => getFeaturedNews(), []);

  const articles = useMemo(
    () => filterNews({ search, category, sort }),
    [search, category, sort]
  );

  const hasFilter = search || category !== "Tất cả" || sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setCategory("Tất cả");
    setSort("newest");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060e1f] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16">

        {/* ── Page Header ── */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
              <Newspaper className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-sm font-semibold text-yellow-500 dark:text-yellow-400 uppercase tracking-widest">
              Tin tức điện ảnh
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            Khám Phá Thế Giới Điện Ảnh
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
            Tin tức mới nhất, review chuyên sâu và hậu trường hấp dẫn từ ngành công nghiệp điện ảnh thế giới.
          </p>
        </Motion.div>

        {/* ── Featured Section ── */}
        {featured.length > 0 && category === "Tất cả" && !search && (
          <Motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nổi bật</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[420px]">
              <div className="md:col-span-2 h-[280px] md:h-full">
                <FeaturedCard article={featured[0]} large />
              </div>
              <div className="grid grid-rows-2 gap-4 h-[280px] md:h-full">
                {featured.slice(1, 3).map(a => (
                  <FeaturedCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </Motion.section>
        )}

        {/* ── Filter Bar ── */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 space-y-4"
        >
          {/* Search + Filter Toggle */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài viết, tag..."
                className="w-full pl-11 pr-4 py-3 rounded-xl
                           bg-white dark:bg-white/5
                           border border-gray-200 dark:border-white/10
                           text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:border-yellow-400/60
                           transition-colors text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilter(f => !f)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all
                          ${showFilter || hasFilter
                            ? "bg-yellow-400/10 border-yellow-400/40 text-yellow-600 dark:text-yellow-400"
                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-yellow-400/40"
                          }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Lọc</span>
              {hasFilter && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilter && (
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl
                                bg-white dark:bg-white/[0.03]
                                border border-gray-200 dark:border-white/10">
                  {/* Sort */}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Sắp xếp
                    </label>
                    <div className="relative">
                      <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg
                                   bg-gray-100 dark:bg-white/5
                                   border border-gray-200 dark:border-white/10
                                   text-gray-900 dark:text-white text-sm
                                   focus:outline-none focus:border-yellow-400/60 cursor-pointer"
                      >
                        {SORT_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Clear */}
                  {hasFilter && (
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg
                                   border border-red-400/30 text-red-400 text-sm hover:bg-red-400/10 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        Xoá bộ lọc
                      </button>
                    </div>
                  )}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border
                            ${category === cat
                              ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20"
                              : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-yellow-400/40 hover:text-yellow-600 dark:hover:text-yellow-300"
                            }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Motion.div>

        {/* ── Results Info ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {articles.length > 0
              ? `Hiển thị ${articles.length} bài viết`
              : "Không tìm thấy kết quả"
            }
            {category !== "Tất cả" && <span className="text-yellow-600 dark:text-yellow-400"> trong "{category}"</span>}
          </p>
        </div>

        {/* ── Articles Grid ── */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        ) : (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Không tìm thấy bài viết
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Thử tìm kiếm với từ khoá khác hoặc xoá bộ lọc
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition"
            >
              Xem tất cả bài viết
            </button>
          </Motion.div>
        )}
      </div>
    </div>
  );
}
