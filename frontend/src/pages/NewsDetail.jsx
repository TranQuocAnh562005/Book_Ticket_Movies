import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion as Motion } from "framer-motion";
import { ArrowLeft, Clock, Eye, Calendar, User, Tag, Share2, BookOpen } from "lucide-react";
import { getNewsById, getRelatedNews, formatDate, formatViews } from "../services/newsService";
import CommentSection from "../components/CommentSection";

const CATEGORY_COLORS = {
  "Tin tức":       "bg-blue-500/20   text-blue-300   border-blue-400/30",
  "Review":        "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  "Công nghệ":     "bg-purple-500/20 text-purple-300 border-purple-400/30",
  "Phỏng vấn":     "bg-green-500/20  text-green-300  border-green-400/30",
  "Hậu trường":    "bg-orange-500/20 text-orange-300 border-orange-400/30",
  "Điện ảnh Việt": "bg-red-500/20    text-red-300    border-red-400/30",
};

function ArticleContent({ content }) {
  const paragraphs = content.split("\n\n").filter(Boolean);
  return (
    <div className="space-y-5">
      {paragraphs.map((para, i) => {
        if (para.startsWith("**") && para.endsWith("**")) {
          const text = para.slice(2, -2);
          return (
            <h3 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">
              {text}
            </h3>
          );
        }
        if (para.includes("**")) {
          const parts = para.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {parts.map((part, j) =>
                j % 2 === 1
                  ? <strong key={j} className="font-bold text-gray-900 dark:text-white">{part}</strong>
                  : <span key={j}>{part}</span>
              )}
            </p>
          );
        }
        if (para.startsWith("-")) {
          const items = para.split("\n").filter(l => l.startsWith("-"));
          return (
            <ul key={i} className="space-y-2 pl-4">
              {items.map((item, j) => (
                <li key={j} className="flex gap-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="text-yellow-400 font-bold mt-1">•</span>
                  <span>{item.slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {para}
          </p>
        );
      })}
    </div>
  );
}

function RelatedCard({ article }) {
  return (
    <Link
      to={`/news/${article.id}`}
      className="group flex gap-4 p-4 rounded-xl
                 bg-white dark:bg-white/5
                 border border-gray-200 dark:border-white/10
                 hover:border-yellow-400/40
                 transition-all duration-200"
    >
      <img
        src={article.thumbnail}
        alt={article.title}
        className="w-20 h-14 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-yellow-500 dark:text-yellow-400 font-semibold mb-1">{article.category}</p>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2
                       group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors leading-snug">
          {article.title}
        </h4>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />{article.readTime} phút đọc
        </p>
      </div>
    </Link>
  );
}

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = useMemo(() => getNewsById(id), [id]);
  const related = useMemo(
    () => article ? getRelatedNews(article.id, article.category, 4) : [],
    [article]
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#060e1f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xoá.</p>
          <Link
            to="/news"
            className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition"
          >
            Về trang tin tức
          </Link>
        </div>
      </div>
    );
  }

  const categoryStyle = CATEGORY_COLORS[article.category] || "bg-gray-500/20 text-gray-300 border-gray-400/30";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060e1f] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16">

        {/* ── Breadcrumb ── */}
        <Motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8"
        >
          <Link to="/" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/news" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">Tin tức</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{article.title}</span>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">

          {/* ── Main Content ── */}
          <Motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400
                         hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>

            {/* Category + Title */}
            <span className={`inline-flex items-center border rounded-full px-3 py-1 text-xs font-semibold mb-4 ${categoryStyle}`}>
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 border-l-4 border-yellow-400 pl-4">
              {article.summary}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6
                            border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <img
                  src={article.authorAvatar}
                  alt={article.author}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-yellow-400/30"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{article.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <User className="w-3 h-3" />Tác giả
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 ml-auto flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  {formatDate(article.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  {article.readTime} phút đọc
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-yellow-400" />
                  {formatViews(article.views)} lượt xem
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-10 aspect-video shadow-2xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Body */}
            <div className="prose-container">
              <ArticleContent content={article.content} />
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm
                               bg-gray-100 dark:bg-white/5
                               border border-gray-200 dark:border-white/10
                               text-gray-600 dark:text-gray-400
                               hover:border-yellow-400/40 hover:text-yellow-600 dark:hover:text-yellow-400
                               transition cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share + Back */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                           bg-white dark:bg-white/5
                           border border-gray-200 dark:border-white/10
                           text-gray-700 dark:text-gray-300
                           hover:border-yellow-400/40 hover:text-yellow-600 dark:hover:text-yellow-400
                           transition text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Chia sẻ bài viết
              </button>
              <Link
                to="/news"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                           bg-yellow-400 hover:bg-yellow-300 text-black font-semibold
                           transition text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Đọc thêm bài viết
              </Link>
            </div>

            {/* Comments */}
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-white/10">
              <CommentSection id={article.id} type="news" withRating={false} />
            </div>
          </Motion.article>

          {/* ── Sidebar ── */}
          <Motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Article Info Card */}
            <div className="rounded-2xl p-5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-yellow-400 inline-block" />
                Thông tin bài viết
              </h3>
              <dl className="space-y-3 text-sm">
                {[
                  { icon: User,     label: "Tác giả",   value: article.author },
                  { icon: Calendar, label: "Ngày đăng",  value: formatDate(article.date) },
                  { icon: Clock,    label: "Thời gian",  value: `${article.readTime} phút đọc` },
                  { icon: Eye,      label: "Lượt xem",   value: formatViews(article.views) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-500">{label}</dt>
                      <dd className="text-gray-900 dark:text-gray-200 font-medium">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="rounded-2xl p-5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-yellow-400 inline-block" />
                  Bài viết liên quan
                </h3>
                <div className="space-y-3">
                  {related.map(a => (
                    <RelatedCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-yellow-400/10 to-orange-400/5
                            border border-yellow-400/20 text-center">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Đặt vé xem phim ngay!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Áp dụng ưu đãi giảm giá cho thành viên mới
              </p>
              <Link
                to="/movie"
                className="block w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300
                           text-black font-semibold transition text-sm"
              >
                Khám phá phim
              </Link>
            </div>
          </Motion.aside>
        </div>
      </div>
    </div>
  );
}
