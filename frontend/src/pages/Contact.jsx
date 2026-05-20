import { useState } from "react";

const CONTACT_INFO = [
  { icon: "📍", label: "Địa chỉ", value: "12 Nguyễn Văn Bảo, Quận Gò Vấp, TP. Hồ Chí Minh" },
  { icon: "📧", label: "Email hỗ trợ", value: "support@ticketflix.me" },
  { icon: "📞", label: "Hotline", value: "1800 xxxx (Miễn phí cuộc gọi)" },
  { icon: "🕐", label: "Giờ hỗ trợ", value: "Thứ 2 – Thứ 7: 8:00 – 22:00" },
];

const SOCIALS = [
  { label: "Facebook", icon: "f", href: "https://facebook.com" },
  { label: "YouTube", icon: "▶", href: "https://youtube.com" },
  { label: "Twitter/X", icon: "X", href: "https://twitter.com" },
];

const SUBJECTS = [
  "Vấn đề đặt vé",
  "Thanh toán",
  "Hoàn / Hủy vé",
  "Tài khoản",
  "Góp ý sản phẩm",
  "Hợp tác kinh doanh",
  "Khác",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0a1a] via-[#0f0f0f] to-[#0a1a10] py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Liên hệ
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-4 text-white/50">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* FORM */}
          <div className="lg:col-span-3">
            <div className="rounded-[28px] border border-white/10 bg-[#111624] p-8">
              <h2 className="mb-6 text-xl font-bold">Gửi tin nhắn</h2>

              {sent ? (
                <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-8 text-center">
                  <div className="mb-3 text-5xl">✅</div>
                  <h3 className="text-lg font-bold text-green-400">Gửi thành công!</h3>
                  <p className="mt-2 text-sm text-white/60">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="mt-5 rounded-xl border border-white/20 px-5 py-2 text-sm transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-white/50">Họ và tên *</span>
                      <input
                        required
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/25 outline-none transition focus:border-yellow-400/60"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-white/50">Email *</span>
                      <input
                        required
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/25 outline-none transition focus:border-yellow-400/60"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-white/50">Số điện thoại</span>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="0912 345 678"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/25 outline-none transition focus:border-yellow-400/60"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-white/50">Chủ đề</span>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/15 bg-[#0f1322] px-4 py-3 text-white outline-none transition focus:border-yellow-400/60"
                      >
                        <option value="">Chọn chủ đề...</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-sm text-white/50">Nội dung *</span>
                    <textarea
                      required
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                      className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/25 outline-none transition focus:border-yellow-400/60"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi tin nhắn →"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-4 lg:col-span-2">
            {CONTACT_INFO.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-white/10 bg-[#111624] p-5 transition hover:border-yellow-400/20"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-white/40">{item.label}</p>
                    <p className="mt-0.5 font-medium">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* SOCIAL */}
            <div className="rounded-[20px] border border-white/10 bg-[#111624] p-5">
              <p className="mb-3 text-sm font-semibold text-white/40">Mạng xã hội</p>
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-bold transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* MAP PLACEHOLDER */}
            <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#111624]">
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f0f0f] text-white/20">
                <div className="text-center">
                  <div className="text-3xl">📍</div>
                  <p className="mt-1 text-xs">Bản đồ</p>
                  <p className="text-[10px]">12 Nguyễn Văn Bảo, Gò Vấp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
