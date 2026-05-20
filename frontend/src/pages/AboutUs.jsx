import { Link } from "react-router-dom";

const CORE_VALUES = [
  {
    icon: "🎬",
    title: "Trải nghiệm điện ảnh",
    desc: "Mang lại trải nghiệm xem phim trọn vẹn từ đặt vé đến rạp chiếu.",
  },
  {
    icon: "⚡",
    title: "Tốc độ & Tiện lợi",
    desc: "Đặt vé chỉ trong 3 bước, mọi lúc mọi nơi trên mọi thiết bị.",
  },
  {
    icon: "🔒",
    title: "Bảo mật & An toàn",
    desc: "Thông tin cá nhân và thanh toán được mã hóa và bảo vệ tuyệt đối.",
  },
  {
    icon: "🤝",
    title: "Cộng đồng điện ảnh",
    desc: "Kết nối hàng triệu tín đồ yêu phim trên toàn quốc.",
  },
];

const TEAM = [
  { name: "Đàm Thái An", role: "Co-Founder & CEO", id: "23710201" },
  { name: "Trần Quốc Anh", role: "Co-Founder & CTO", id: "23710221" },
  { name: "Hoàng Phước Thành Công", role: "Lead Developer", id: "Dev" },
  { name: "Tiến Đạt", role: "Full-Stack Developer", id: "Dev" },
];

const STATS = [
  { value: "500K+", label: "Vé đã bán" },
  { value: "50+", label: "Rạp đối tác" },
  { value: "20+", label: "Tỉnh thành" },
  { value: "4.9★", label: "Đánh giá người dùng" },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0a00] via-[#0f0f0f] to-[#0a0a1a] py-28 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.09)_0%,_transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Về chúng tôi
          </span>
          <h1 className="mt-5 text-5xl font-bold leading-tight md:text-6xl">
            Chào mừng đến với{" "}
            <span className="text-yellow-400">TicketFlix</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/55">
            Nền tảng đặt vé xem phim trực tuyến hàng đầu Việt Nam — kết nối bạn
            với những trải nghiệm điện ảnh đỉnh cao một cách nhanh chóng và an toàn.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/movie"
              className="rounded-2xl bg-yellow-400 px-8 py-3 font-semibold text-black transition hover:bg-yellow-300 hover:scale-105"
            >
              Khám phá phim ngay
            </Link>
            <Link
              to="/contact"
              className="rounded-2xl border border-white/20 px-8 py-3 font-semibold transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Liên hệ chúng tôi
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="border-b border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-y divide-white/10 md:grid-cols-4 md:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="py-8 text-center">
              <p className="text-3xl font-bold text-yellow-400">{s.value}</p>
              <p className="mt-1 text-sm text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-20 px-6 py-20">
        {/* MISSION & VISION */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-[#111624] p-8 transition hover:border-yellow-400/20">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-2xl">
              🎯
            </div>
            <h2 className="text-2xl font-bold text-yellow-400">Sứ mệnh</h2>
            <p className="mt-4 leading-7 text-white/60">
              TicketFlix ra đời với sứ mệnh đơn giản hóa trải nghiệm đặt vé xem phim, giúp
              mọi người dễ dàng tiếp cận điện ảnh chất lượng cao mà không phải mất thời
              gian xếp hàng hay gặp rắc rối về thanh toán. Chúng tôi tin rằng mọi người
              đều xứng đáng được thưởng thức điện ảnh theo cách thuận tiện nhất.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#111624] p-8 transition hover:border-yellow-400/20">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-2xl">
              🔭
            </div>
            <h2 className="text-2xl font-bold text-yellow-400">Tầm nhìn</h2>
            <p className="mt-4 leading-7 text-white/60">
              Trở thành nền tảng đặt vé giải trí hàng đầu Đông Nam Á vào năm 2030, mang
              lại trải nghiệm liền mạch và cá nhân hóa cho hàng triệu người dùng yêu điện
              ảnh. Chúng tôi không chỉ bán vé — chúng tôi kiến tạo những kỷ niệm điện ảnh
              đáng nhớ.
            </p>
          </div>
        </div>

        {/* CORE VALUES */}
        <div>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Giá trị cốt lõi</h2>
            <p className="mt-2 text-white/40">Những điều định hình văn hóa TicketFlix</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-[24px] border border-white/10 bg-[#111624] p-6 text-center transition hover:-translate-y-1 hover:border-yellow-400/40"
              >
                <span className="text-4xl">{v.icon}</span>
                <h3 className="mt-3 font-bold text-yellow-400">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM */}
        <div>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Đội ngũ sáng lập</h2>
            <p className="mt-2 text-white/40">Những con người trẻ đam mê điện ảnh và công nghệ</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-[24px] border border-white/10 bg-[#111624] p-6 text-center transition hover:-translate-y-1 hover:border-yellow-400/40"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-xl font-bold text-black">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-white">{member.name}</h3>
                <p className="mt-1 text-sm text-yellow-400">{member.role}</p>
                <p className="mt-1 text-xs text-white/30">{member.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[28px] border border-yellow-400/20 bg-gradient-to-r from-[#1b1500] via-[#111624] to-[#1b1500] p-14 text-center">
          <h2 className="text-3xl font-bold">Sẵn sàng trải nghiệm chưa?</h2>
          <p className="mt-3 text-white/50">Hàng nghìn suất chiếu đang chờ bạn khám phá mỗi ngày.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/movie"
              className="rounded-2xl bg-yellow-400 px-8 py-3 font-semibold text-black transition hover:bg-yellow-300 hover:scale-105"
            >
              Xem phim đang chiếu
            </Link>
            <Link
              to="/careers"
              className="rounded-2xl border border-white/20 px-8 py-3 font-semibold transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Gia nhập đội ngũ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
