const SECTIONS = [
  {
    title: "1. Thông tin chúng tôi thu thập",
    content: `TicketFlix thu thập các loại thông tin sau:\n\n**Thông tin bạn cung cấp:**\n• Họ tên, địa chỉ email, số điện thoại khi đăng ký tài khoản.\n• Thông tin thanh toán (chỉ xử lý qua cổng bảo mật, không lưu trực tiếp).\n• Nội dung liên lạc khi bạn liên hệ hỗ trợ.\n\n**Thông tin thu thập tự động:**\n• Địa chỉ IP, loại trình duyệt, thiết bị sử dụng.\n• Lịch sử đặt vé và hành vi sử dụng trên nền tảng.\n• Cookie và dữ liệu phiên làm việc.`,
  },
  {
    title: "2. Mục đích sử dụng thông tin",
    content: `Chúng tôi sử dụng thông tin của bạn để:\n• Xử lý và quản lý đặt vé, giao dịch thanh toán.\n• Gửi xác nhận vé, thông báo quan trọng về đơn hàng.\n• Cải thiện trải nghiệm người dùng và tính năng sản phẩm.\n• Phân tích xu hướng sử dụng để phát triển dịch vụ tốt hơn.\n• Gửi thông tin khuyến mãi nếu bạn đã đồng ý nhận (có thể hủy đăng ký bất kỳ lúc nào).\n• Phòng chống gian lận và đảm bảo an toàn hệ thống.`,
  },
  {
    title: "3. Chia sẻ thông tin với bên thứ ba",
    content: `TicketFlix KHÔNG bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ với:\n\n• **Rạp chiếu phim đối tác:** thông tin cần thiết để xác nhận vé.\n• **Đối tác thanh toán:** để xử lý giao dịch an toàn (MoMo, ZaloPay, Visa...).\n• **Nhà cung cấp dịch vụ:** hosting, phân tích dữ liệu — đều ký thỏa thuận bảo mật.\n• **Cơ quan pháp luật:** khi có yêu cầu hợp pháp từ cơ quan nhà nước.`,
  },
  {
    title: "4. Bảo mật thông tin",
    content: `Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt:\n• Mã hóa SSL/TLS 256-bit cho tất cả dữ liệu truyền tải.\n• Mật khẩu được mã hóa bằng bcrypt, không lưu dạng văn bản.\n• Kiểm tra bảo mật định kỳ và cập nhật hệ thống thường xuyên.\n• Giới hạn quyền truy cập nội bộ theo nguyên tắc "cần biết".\n\nTuy nhiên, không có phương thức truyền tải qua Internet nào là hoàn toàn an toàn tuyệt đối.`,
  },
  {
    title: "5. Cookie và công nghệ theo dõi",
    content: `TicketFlix sử dụng cookie để:\n• Duy trì phiên đăng nhập của bạn.\n• Ghi nhớ tùy chọn và cài đặt cá nhân.\n• Phân tích lưu lượng và hành vi người dùng (thông qua Google Analytics).\n\nBạn có thể tắt cookie trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng.`,
  },
  {
    title: "6. Quyền của bạn",
    content: `Bạn có các quyền sau đối với dữ liệu cá nhân của mình:\n• **Quyền truy cập:** Yêu cầu xem thông tin chúng tôi đang lưu về bạn.\n• **Quyền chỉnh sửa:** Cập nhật thông tin không chính xác.\n• **Quyền xóa:** Yêu cầu xóa tài khoản và dữ liệu liên quan.\n• **Quyền từ chối:** Hủy đăng ký nhận email marketing bất kỳ lúc nào.\n• **Quyền di chuyển:** Yêu cầu xuất dữ liệu cá nhân theo định dạng chuẩn.\n\nLiên hệ privacy@ticketflix.me để thực hiện các quyền trên.`,
  },
  {
    title: "7. Lưu giữ dữ liệu",
    content: `Chúng tôi lưu giữ dữ liệu cá nhân trong thời gian cần thiết để cung cấp dịch vụ, hoặc theo yêu cầu pháp lý:\n• Tài khoản hoạt động: trong suốt thời gian sử dụng dịch vụ.\n• Sau khi xóa tài khoản: tối đa 90 ngày trong hệ thống backup trước khi xóa hoàn toàn.\n• Dữ liệu giao dịch tài chính: 5 năm theo quy định pháp luật.`,
  },
  {
    title: "8. Thay đổi chính sách",
    content: `Chính sách Bảo mật này có thể được cập nhật định kỳ. Chúng tôi sẽ thông báo qua:\n• Email đã đăng ký.\n• Thông báo nổi bật trên trang web.\n\nViệc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận Chính sách mới.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1a] via-[#0f0f0f] to-[#0f0a1a] py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.06)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Pháp lý
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Chính sách bảo mật</h1>
          <p className="mt-3 text-sm text-white/40">Cập nhật lần cuối: 01/01/2025</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* INTRO */}
        <div className="mb-10 rounded-[20px] border border-blue-400/20 bg-blue-400/5 p-6">
          <p className="leading-relaxed text-white/70">
            TicketFlix cam kết bảo vệ thông tin cá nhân của bạn. Chính sách này giải thích cách
            chúng tôi thu thập, sử dụng, lưu giữ và bảo vệ dữ liệu của bạn khi sử dụng dịch vụ
            TicketFlix.
          </p>
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

        {/* CONTACT */}
        <div className="mt-10 rounded-[20px] border border-white/10 bg-[#111624] p-6 text-center text-sm text-white/50">
          <p>Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ:</p>
          <p className="mt-1 font-medium text-white">📧 privacy@ticketflix.me</p>
          <p className="mt-1">📍 12 Nguyễn Văn Bảo, Quận Gò Vấp, TP. Hồ Chí Minh</p>
        </div>
      </div>
    </div>
  );
}
