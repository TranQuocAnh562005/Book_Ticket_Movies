import { useState } from "react";

const PERKS = [
  { icon: "💰", title: "Lương cạnh tranh", desc: "Top thị trường, review 2 lần/năm kèm thưởng hiệu suất." },
  { icon: "🏖️", title: "20 ngày phép/năm", desc: "Nghỉ phép linh hoạt, hỗ trợ làm việc từ xa (WFH)." },
  { icon: "🎓", title: "Phát triển bản thân", desc: "Budget 5 triệu/năm cho khóa học, hội thảo và sách." },
  { icon: "🎬", title: "Xem phim miễn phí", desc: "Vé xem phim miễn phí hàng tuần tại các rạp đối tác." },
  { icon: "🏥", title: "Bảo hiểm cao cấp", desc: "Bảo hiểm y tế toàn diện cho nhân viên và người thân." },
  { icon: "🚀", title: "Lộ trình thăng tiến", desc: "Mentorship rõ ràng, cơ hội phát triển không giới hạn." },
];

const POSITIONS = [
  {
    id: 1,
    title: "Senior React Developer",
    dept: "Kỹ thuật",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    level: "Senior",
    salary: "35 – 60 triệu",
    desc: "Xây dựng và tối ưu giao diện người dùng cho nền tảng đặt vé hàng triệu người dùng. Yêu cầu: React 18+, TypeScript, TailwindCSS, kinh nghiệm 3+ năm.",
    skills: ["React", "TypeScript", "TailwindCSS", "REST API"],
  },
  {
    id: 2,
    title: "Node.js Backend Engineer",
    dept: "Kỹ thuật",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    level: "Mid/Senior",
    salary: "30 – 55 triệu",
    desc: "Thiết kế và xây dựng API, microservices cho hệ thống booking thời gian thực với hàng triệu request/ngày.",
    skills: ["Node.js", "Express", "MongoDB", "WebSocket", "Redis"],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    dept: "Thiết kế",
    location: "Remote / HCM",
    type: "Toàn thời gian",
    level: "Mid",
    salary: "20 – 35 triệu",
    desc: "Tạo ra trải nghiệm người dùng xuất sắc cho ứng dụng web và mobile. Portfolio ấn tượng là điểm cộng lớn.",
    skills: ["Figma", "Adobe XD", "Prototyping", "Design System"],
  },
  {
    id: 4,
    title: "Digital Marketing Specialist",
    dept: "Marketing",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    level: "Mid",
    salary: "18 – 28 triệu",
    desc: "Lên chiến lược và triển khai các chiến dịch marketing số để tăng trưởng người dùng và doanh thu.",
    skills: ["Google Ads", "Meta Ads", "SEO", "Analytics", "Content"],
  },
  {
    id: 5,
    title: "Customer Success Manager",
    dept: "Chăm sóc khách hàng",
    location: "Hà Nội / HCM",
    type: "Toàn thời gian",
    level: "Junior/Mid",
    salary: "12 – 18 triệu",
    desc: "Đảm bảo trải nghiệm hài lòng cho khách hàng, xử lý khiếu nại và xây dựng mối quan hệ bền vững.",
    skills: ["CRM", "Giao tiếp", "Giải quyết vấn đề", "Tiếng Anh"],
  },
];

const levelColor = {
  Senior: "text-yellow-400 bg-yellow-400/10",
  "Mid/Senior": "text-blue-400 bg-blue-400/10",
  Mid: "text-green-400 bg-green-400/10",
  "Junior/Mid": "text-purple-400 bg-purple-400/10",
};

export default function Careers() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1a0a] via-[#0f0f0f] to-[#1a0a1a] py-28 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Tuyển dụng
          </span>
          <h1 className="mt-4 text-5xl font-bold leading-tight">
            Cùng xây dựng<br />
            <span className="text-yellow-400">tương lai điện ảnh</span>
          </h1>
          <p className="mt-5 text-lg text-white/55">
            Gia nhập đội ngũ TicketFlix — nơi đam mê điện ảnh gặp gỡ công nghệ đỉnh cao.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <span>🏢 {POSITIONS.length} vị trí đang tuyển</span>
            <span>🌍 HCM · Hà Nội · Remote</span>
            <span>⚡ Phản hồi trong 3 ngày</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-16">
        {/* PERKS */}
        <div>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold">Tại sao làm việc tại TicketFlix?</h2>
            <p className="mt-2 text-white/40">Chúng tôi đặt con người lên trên hết</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((p) => (
              <div
                key={p.title}
                className="rounded-[20px] border border-white/10 bg-[#111624] p-5 transition hover:-translate-y-0.5 hover:border-yellow-400/30"
              >
                <span className="text-3xl">{p.icon}</span>
                <h3 className="mt-2 font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* JOB LISTINGS */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            Vị trí đang tuyển dụng
            <span className="ml-3 rounded-full bg-yellow-400/15 px-3 py-1 text-sm font-medium text-yellow-400">
              {POSITIONS.length} vị trí
            </span>
          </h2>
          <div className="space-y-4">
            {POSITIONS.map((pos) => (
              <div
                key={pos.id}
                className="overflow-hidden rounded-[20px] border border-white/10 bg-[#111624] transition hover:border-yellow-400/30"
              >
                <button
                  onClick={() => setExpandedId(expandedId === pos.id ? null : pos.id)}
                  className="flex w-full items-start justify-between gap-4 p-6 text-left"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                      <span className="rounded-full bg-yellow-400/10 px-2.5 py-0.5 text-yellow-400">
                        {pos.dept}
                      </span>
                      <span>{pos.location}</span>
                      <span>·</span>
                      <span>{pos.type}</span>
                      <span>·</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 ${levelColor[pos.level] || "text-white/40 bg-white/5"}`}
                      >
                        {pos.level}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold">{pos.title}</h3>
                    <p className="mt-1 text-sm text-yellow-400/70">{pos.salary} / tháng</p>
                  </div>
                  <span
                    className={`mt-1 shrink-0 text-2xl leading-none text-yellow-400 transition-transform duration-300 ${
                      expandedId === pos.id ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedId === pos.id ? "max-h-60" : "max-h-0"
                  }`}
                >
                  <div className="border-t border-white/10 px-6 py-5">
                    <p className="leading-relaxed text-white/60">{pos.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {pos.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`mailto:careers@ticketflix.me?subject=Ứng tuyển: ${pos.title}`}
                      className="mt-5 inline-block rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300 hover:scale-105"
                    >
                      Ứng tuyển ngay →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-[28px] border border-yellow-400/20 bg-gradient-to-r from-[#1b1500]/60 via-[#111624] to-[#1b1500]/60 p-12 text-center">
          <h2 className="text-2xl font-bold">Không thấy vị trí phù hợp?</h2>
          <p className="mt-3 text-white/50">
            Gửi CV tự do cho chúng tôi — chúng tôi luôn tìm kiếm tài năng xuất sắc.
          </p>
          <a
            href="mailto:careers@ticketflix.me?subject=CV tự do - TicketFlix"
            className="mt-6 inline-block rounded-2xl bg-yellow-400 px-8 py-3 font-semibold text-black transition hover:bg-yellow-300 hover:scale-105"
          >
            Gửi CV tự do
          </a>
        </div>
      </div>
    </div>
  );
}
