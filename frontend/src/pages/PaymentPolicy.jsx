import { Link } from "react-router-dom";

const PAYMENT_METHODS = [
  {
    name: "MoMo",
    icon: "💜",
    desc: "Thanh toán qua ví điện tử MoMo. Giao dịch xử lý tức thì 24/7.",
    note: "Yêu cầu tài khoản MoMo đã kích hoạt và đủ số dư.",
  },
  {
    name: "ZaloPay",
    icon: "💙",
    desc: "Thanh toán qua ví ZaloPay. Hỗ trợ liên kết thẻ ngân hàng.",
    note: "Yêu cầu tài khoản ZaloPay đã xác minh.",
  },
  {
    name: "Visa / Mastercard",
    icon: "💳",
    desc: "Thẻ tín dụng / ghi nợ quốc tế. Hỗ trợ 3D Secure.",
    note: "Thẻ phải được kích hoạt tính năng thanh toán trực tuyến.",
  },
];

const SECTIONS = [
  {
    title: "1. Quy trình thanh toán",
    content: `Quy trình đặt vé và thanh toán trên TicketFlix diễn ra như sau:\n\n① Chọn phim, suất chiếu và ghế ngồi mong muốn.\n② Xem lại thông tin đặt vé và nhấn "Thanh toán".\n③ Chọn phương thức thanh toán phù hợp.\n④ Hoàn tất thanh toán trên cổng của đối tác (MoMo, ZaloPay, Visa...).\n⑤ Nhận xác nhận và vé điện tử kèm mã QR tại mục "Vé của tôi".`,
  },
  {
    title: "2. Bảo mật thanh toán",
    content: `TicketFlix cam kết bảo mật tuyệt đối thông tin tài chính:\n• Tất cả giao dịch được mã hóa SSL/TLS 256-bit.\n• Thông tin thẻ thanh toán KHÔNG được lưu trữ trực tiếp trên hệ thống TicketFlix.\n• Chúng tôi sử dụng các cổng thanh toán được cấp phép và tuân thủ tiêu chuẩn PCI-DSS.\n• Mọi giao dịch đều có nhật ký kiểm toán đầy đủ.`,
  },
  {
    title: "3. Xác nhận giao dịch",
    content: `Sau khi thanh toán thành công:\n• Vé điện tử xuất hiện ngay lập tức trong tài khoản của bạn.\n• Email xác nhận được gửi tới địa chỉ email đã đăng ký.\n• Mã đơn hàng (dạng TF-XXXXXXXX) được tạo và hiển thị.\n\nNếu không nhận được xác nhận trong vòng 15 phút, vui lòng kiểm tra mục "Vé của tôi" hoặc liên hệ hỗ trợ.`,
  },
  {
    title: "4. Chính sách hoàn vé",
    content: `TicketFlix áp dụng chính sách KHÔNG HOÀN VÉ trong điều kiện thông thường.\n\n**Trường hợp được hoàn tiền:**\n• Suất chiếu bị rạp hủy hoặc dời lịch: hoàn 100% trong 3–7 ngày làm việc.\n• Lỗi kỹ thuật từ phía TicketFlix gây mất vé: xử lý theo từng trường hợp.\n• Thanh toán trùng lặp do lỗi hệ thống: hoàn toàn bộ trong 5 ngày làm việc.\n\n**Không hoàn tiền trong trường hợp:**\n• Người dùng chọn nhầm suất chiếu, ghế, hoặc rạp.\n• Đến muộn, bỏ lỡ suất chiếu.\n• Thay đổi kế hoạch cá nhân.`,
  },
  {
    title: "5. Xử lý giao dịch lỗi",
    content: `Khi gặp sự cố thanh toán:\n\n• **Tiền bị trừ nhưng không có vé:** Kiểm tra mục "Vé của tôi". Nếu vé không xuất hiện sau 30 phút, liên hệ hỗ trợ kèm mã giao dịch.\n• **Thanh toán thất bại:** Tiền chưa bị trừ, vui lòng thử lại hoặc đổi phương thức thanh toán.\n• **Giao dịch trùng lặp:** Chúng tôi sẽ hoàn lại phần tiền trùng trong 3–5 ngày làm việc.\n\nMọi khiếu nại cần được gửi trong vòng 48 giờ từ thời điểm giao dịch.`,
  },
  {
    title: "6. Phí và thuế",
    content: `• Giá vé hiển thị đã bao gồm VAT theo quy định hiện hành.\n• Một số phương thức thanh toán có thể phát sinh phí giao dịch từ đối tác thanh toán (không phải từ TicketFlix).\n• Phí dịch vụ (nếu có) sẽ được hiển thị rõ ràng trước khi bạn xác nhận thanh toán.`,
  },
  {
    title: "7. Liên hệ hỗ trợ thanh toán",
    content: `Để được hỗ trợ về thanh toán, vui lòng liên hệ:\n• Email: billing@ticketflix.me\n• Hotline: 1800 xxxx (Miễn phí, 8:00 – 22:00)\n• Chat trực tiếp: tại trung tâm trợ giúp trên ứng dụng\n\nVui lòng chuẩn bị: mã đơn hàng, số điện thoại đăng ký, và ảnh chụp lỗi (nếu có) để được hỗ trợ nhanh nhất.`,
  },
];

export default function PaymentPolicy() {
  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1a0a] via-[#0f0f0f] to-[#0a0f1a] py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.06)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Pháp lý
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Quy định thanh toán</h1>
          <p className="mt-3 text-sm text-white/40">Cập nhật lần cuối: 01/01/2025</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* PAYMENT METHODS */}
        <div className="mb-10">
          <h2 className="mb-5 text-xl font-bold">Phương thức thanh toán được hỗ trợ</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PAYMENT_METHODS.map((m) => (
              <div
                key={m.name}
                className="rounded-[20px] border border-white/10 bg-[#111624] p-5 transition hover:border-yellow-400/30"
              >
                <span className="text-3xl">{m.icon}</span>
                <h3 className="mt-2 font-bold">{m.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{m.desc}</p>
                <p className="mt-2 text-[11px] text-white/30">{m.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-5">
          {SECTIONS.map((sec) => (
            <div
              key={sec.title}
              className="rounded-[20px] border border-white/10 bg-[#111624] p-6 transition hover:border-white/20"
            >
              <h2 className="mb-3 font-bold text-yellow-400">{sec.title}</h2>
              <div className="whitespace-pre-line text-sm leading-7 text-white/60">
                {sec.content.split(/\*\*(.*?)\*\*/).map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="text-white/80 font-semibold">{part}</strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 rounded-[20px] border border-white/10 bg-[#111624] p-8 text-center">
          <div className="w-full">
            <p className="text-sm text-white/50">Có vấn đề về thanh toán?</p>
          </div>
          <Link
            to="/contact"
            className="rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            Liên hệ hỗ trợ
          </Link>
          <Link
            to="/faq"
            className="rounded-xl border border-white/20 px-6 py-2.5 text-sm font-semibold transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Xem câu hỏi thường gặp
          </Link>
        </div>
      </div>
    </div>
  );
}
