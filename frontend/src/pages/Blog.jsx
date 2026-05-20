import { useState } from "react";

const TAGS = ["Tất cả", "Tin tức", "Review phim", "Sự kiện", "Công nghệ", "Hậu trường"];

const POSTS = [
  {
    id: 1,
    tag: "Review phim",
    title: "Avengers: Secret Wars — Bom tấn kết thúc kỷ nguyên Marvel mới",
    excerpt:
      "Bộ phim được mong chờ nhất 2025 cuối cùng cũng ra mắt. Cùng điểm qua những điểm nổi bật và đánh giá chi tiết về siêu phẩm này.",
    author: "Biên tập viên TicketFlix",
    date: "15/05/2025",
    readTime: "5 phút",
    gradient: "from-red-900/25 to-orange-900/10",
  },
  {
    id: 2,
    tag: "Tin tức",
    title: "TicketFlix mở rộng đến 20 thành phố mới trên toàn quốc",
    excerpt:
      "Với mục tiêu phủ sóng toàn quốc, TicketFlix chính thức hợp tác với 50 rạp chiếu phim mới tại 20 tỉnh thành trên cả nước.",
    author: "Nhóm Marketing",
    date: "12/05/2025",
    readTime: "3 phút",
    gradient: "from-blue-900/25 to-indigo-900/10",
  },
  {
    id: 3,
    tag: "Sự kiện",
    title: "Đêm hội điện ảnh TicketFlix 2025 — Khép lại mùa phim sôi động",
    excerpt:
      "Sự kiện điện ảnh lớn nhất trong năm với sự tham gia của hơn 500 khán giả và nhiều diễn viên nổi tiếng cùng các tiết mục đặc sắc.",
    author: "Ban Tổ chức",
    date: "08/05/2025",
    readTime: "7 phút",
    gradient: "from-purple-900/25 to-pink-900/10",
  },
  {
    id: 4,
    tag: "Công nghệ",
    title: "Tính năng đặt vé thông minh AI — Gợi ý ghế ngồi tốt nhất cho bạn",
    excerpt:
      "TicketFlix ra mắt tính năng AI gợi ý ghế ngồi dựa trên lịch sử xem phim và sở thích cá nhân của từng người dùng.",
    author: "Nhóm Kỹ thuật",
    date: "05/05/2025",
    readTime: "4 phút",
    gradient: "from-green-900/25 to-teal-900/10",
  },
  {
    id: 5,
    tag: "Hậu trường",
    title: "Bí mật đằng sau màn hình — Hành trình xây dựng TicketFlix",
    excerpt:
      "Câu chuyện về những ngày đầu khởi nghiệp, những thách thức và bài học quý giá trên hành trình xây dựng nền tảng yêu thích.",
    author: "Đội ngũ sáng lập",
    date: "01/05/2025",
    readTime: "10 phút",
    gradient: "from-yellow-900/25 to-amber-900/10",
  },
  {
    id: 6,
    tag: "Review phim",
    title: "Top 10 phim Việt hay nhất nửa đầu 2025 không thể bỏ lỡ",
    excerpt:
      "Điện ảnh Việt Nam đang bước vào giai đoạn rực rỡ nhất. Cùng điểm qua những tác phẩm xuất sắc đáng xem nhất trong năm.",
    author: "Biên tập viên TicketFlix",
    date: "25/04/2025",
    readTime: "6 phút",
    gradient: "from-orange-900/25 to-red-900/10",
  },
];

export default function Blog() {
  const [activeTag, setActiveTag] = useState("Tất cả");

  const filtered =
    activeTag === "Tất cả" ? POSTS : POSTS.filter((p) => p.tag === activeTag);

  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a1a] via-[#0f0f0f] to-[#1a0a00] py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.07)_0%,_transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Blog
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Tin tức & Câu chuyện
          </h1>
          <p className="mt-4 text-white/50">
            Cập nhật những tin tức điện ảnh mới nhất, review phim và sự kiện từ TicketFlix
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* TAG FILTER */}
        <div className="mb-10 flex flex-wrap gap-3">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                activeTag === tag
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                  : "border border-white/10 bg-[#111624] text-white/60 hover:border-yellow-400/40 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* FEATURED POST */}
        {activeTag === "Tất cả" && (
          <div className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-[#1b2033] via-[#111624] to-[#0f1322] p-8 transition hover:border-yellow-400/40">
            <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
              Nổi bật
            </span>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl leading-snug hover:text-yellow-400 transition cursor-pointer">
              {POSTS[0].title}
            </h2>
            <p className="mt-3 text-white/55 leading-relaxed max-w-2xl">{POSTS[0].excerpt}</p>
            <div className="mt-5 flex items-center gap-4 text-sm text-white/40">
              <span>{POSTS[0].author}</span>
              <span>·</span>
              <span>{POSTS[0].date}</span>
              <span>·</span>
              <span>{POSTS[0].readTime} đọc</span>
            </div>
          </div>
        )}

        {/* POSTS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <article
              key={post.id}
              className={`group flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br ${post.gradient} bg-[#111624] transition hover:-translate-y-1 hover:border-yellow-400/40`}
            >
              <div className="flex-1 p-6">
                <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                  {post.tag}
                </span>
                <h2 className="mt-3 text-[15px] font-bold leading-snug transition group-hover:text-yellow-400">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/50 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-white/40">
                <span>
                  {post.date} · {post.readTime} đọc
                </span>
                <span className="font-medium text-yellow-400/60 transition group-hover:text-yellow-400">
                  Đọc tiếp →
                </span>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-[24px] border border-white/10 bg-[#111624] py-16 text-center text-white/40">
            Không có bài viết nào trong danh mục này.
          </div>
        )}
      </div>
    </div>
  );
}
