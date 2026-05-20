import { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { icon: "🎟️", title: "Đặt vé & Thanh toán", count: 12, accent: "yellow" },
  { icon: "🪑", title: "Chọn ghế & Phòng chiếu", count: 8, accent: "blue" },
  { icon: "📱", title: "Tài khoản & Đăng nhập", count: 10, accent: "purple" },
  { icon: "↩️", title: "Hoàn vé & Đổi lịch", count: 6, accent: "red" },
  { icon: "🎁", title: "Ưu đãi & Voucher", count: 7, accent: "green" },
  { icon: "🔧", title: "Hỗ trợ kỹ thuật", count: 5, accent: "orange" },
];

const POPULAR = [
  { q: "Tôi có thể hủy vé sau khi thanh toán không?", cat: "Hoàn vé" },
  { q: "Làm sao để nhận vé điện tử sau khi đặt?", cat: "Đặt vé" },
  { q: "Tại sao thanh toán MoMo của tôi bị thất bại?", cat: "Thanh toán" },
  { q: "Làm thế nào để đổi ghế sau khi đã chọn?", cat: "Ghế ngồi" },
  { q: "Voucher của tôi không áp dụng được, phải làm sao?", cat: "Ưu đãi" },
  { q: "Tôi quên mật khẩu, làm sao để lấy lại?", cat: "Tài khoản" },
  { q: "Mã QR trên vé điện tử có thời hạn bao lâu?", cat: "Đặt vé" },
  { q: "Ghế VIP và ghế thường khác nhau như thế nào?", cat: "Ghế ngồi" },
];

const accentMap = {
  yellow: "border-yellow-400/20 hover:border-yellow-400/50",
  blue: "border-blue-400/20 hover:border-blue-400/50",
  purple: "border-purple-400/20 hover:border-purple-400/50",
  red: "border-red-400/20 hover:border-red-400/50",
  green: "border-green-400/20 hover:border-green-400/50",
  orange: "border-orange-400/20 hover:border-orange-400/50",
};

export default function HelpCenter() {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? POPULAR.filter((p) => p.q.toLowerCase().includes(query.toLowerCase()))
    : POPULAR;

  return (
    <div className="min-h-screen text-white">
      {/* HERO + SEARCH */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1a] via-[#0f0f0f] to-[#0a1a0a] py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Trung tâm trợ giúp
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Chúng tôi có thể<br />giúp gì cho bạn?
          </h1>
          <p className="mt-4 text-white/50">
            Tìm kiếm câu trả lời nhanh trong hàng trăm bài viết hỗ trợ
          </p>
          <div className="relative mt-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm..."
              className="w-full rounded-2xl border border-white/20 bg-white/5 px-6 py-4 pr-28 text-white placeholder-white/30 outline-none backdrop-blur transition focus:border-yellow-400/60 focus:bg-white/8"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300">
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-6 py-14">
        {/* CATEGORIES */}
        <div>
          <h2 className="mb-6 text-xl font-bold">Danh mục hỗ trợ</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className={`group cursor-pointer rounded-[20px] border bg-[#111624] p-5 transition hover:-translate-y-0.5 ${accentMap[cat.accent]}`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <div className="mt-3 flex items-center justify-between">
                  <h3 className="font-semibold group-hover:text-yellow-400 transition-colors">
                    {cat.title}
                  </h3>
                  <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/40">
                    {cat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POPULAR QUESTIONS */}
        <div>
          <h2 className="mb-6 text-xl font-bold">
            {query ? `Kết quả cho "${query}"` : "Câu hỏi phổ biến"}
          </h2>
          {filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((item, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#111624] px-5 py-4 transition hover:border-yellow-400/40 hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 rounded-lg bg-yellow-400/10 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                      {item.cat}
                    </span>
                    <span className="text-white/80 group-hover:text-white transition-colors">
                      {item.q}
                    </span>
                  </div>
                  <span className="shrink-0 text-yellow-400 opacity-0 transition group-hover:opacity-100">
                    →
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#111624] py-10 text-center text-white/40">
              Không tìm thấy kết quả. Hãy thử từ khóa khác.
            </div>
          )}
        </div>

        {/* SUPPORT CHANNELS */}
        <div>
          <h2 className="mb-6 text-xl font-bold">Kênh hỗ trợ trực tiếp</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[20px] border border-white/10 bg-[#111624] p-6 text-center transition hover:border-yellow-400/30">
              <div className="mb-3 text-4xl">💬</div>
              <h3 className="font-bold">Chat trực tiếp</h3>
              <p className="mt-2 text-sm text-white/50">
                Phản hồi trong 5 phút.<br />Mở cửa 8:00 – 22:00 hàng ngày.
              </p>
              <button className="mt-4 rounded-xl bg-yellow-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300">
                Bắt đầu chat
              </button>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#111624] p-6 text-center transition hover:border-yellow-400/30">
              <div className="mb-3 text-4xl">📧</div>
              <h3 className="font-bold">Email hỗ trợ</h3>
              <p className="mt-2 text-sm text-white/50">
                Gửi yêu cầu chi tiết.<br />Phản hồi trong 24 giờ làm việc.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-block rounded-xl border border-white/20 px-5 py-2 text-sm font-semibold transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Gửi yêu cầu
              </Link>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#111624] p-6 text-center transition hover:border-yellow-400/30">
              <div className="mb-3 text-4xl">📋</div>
              <h3 className="font-bold">Câu hỏi thường gặp</h3>
              <p className="mt-2 text-sm text-white/50">
                Câu trả lời có sẵn cho<br />mọi tình huống phổ biến.
              </p>
              <Link
                to="/faq"
                className="mt-4 inline-block rounded-xl border border-white/20 px-5 py-2 text-sm font-semibold transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Xem FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
