const SECTIONS = [
  {
    title: "1. Chấp nhận điều khoản",
    content: `Bằng cách truy cập và sử dụng dịch vụ TicketFlix ("Dịch vụ"), bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản Sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng không sử dụng Dịch vụ của chúng tôi.\n\nCác điều khoản này áp dụng cho tất cả khách truy cập, người dùng và các bên khác truy cập hoặc sử dụng Dịch vụ.`,
  },
  {
    title: "2. Điều kiện sử dụng dịch vụ",
    content: `Để sử dụng TicketFlix, bạn phải:\n• Từ 16 tuổi trở lên hoặc có sự đồng ý của phụ huynh/người giám hộ.\n• Cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký.\n• Không sử dụng tài khoản của người khác mà không được phép.\n• Tuân thủ mọi luật pháp và quy định hiện hành của Việt Nam.\n• Không thực hiện bất kỳ hành vi gian lận hay lạm dụng hệ thống.`,
  },
  {
    title: "3. Tài khoản người dùng",
    content: `Khi tạo tài khoản trên TicketFlix, bạn chịu trách nhiệm:\n• Bảo mật mật khẩu và thông tin đăng nhập của mình.\n• Mọi hoạt động diễn ra dưới tài khoản của bạn.\n• Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép.\n\nChúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản vi phạm điều khoản mà không cần thông báo trước.`,
  },
  {
    title: "4. Đặt vé và thanh toán",
    content: `Khi đặt vé qua TicketFlix:\n• Giao dịch chỉ hoàn tất sau khi thanh toán được xác nhận thành công.\n• Giá vé có thể thay đổi theo thời điểm và chính sách của từng rạp.\n• Chúng tôi không chịu trách nhiệm về lỗi kỹ thuật từ bên cung cấp dịch vụ thanh toán.\n• Vé đã mua không được hoàn tiền trừ trường hợp suất chiếu bị hủy bởi rạp.`,
  },
  {
    title: "5. Chính sách hoàn/hủy vé",
    content: `TicketFlix áp dụng chính sách KHÔNG HOÀN VÉ trong các trường hợp thông thường. Ngoại lệ:\n• Suất chiếu bị rạp hủy: hoàn 100% giá trị vé trong vòng 3–7 ngày làm việc.\n• Lỗi kỹ thuật nghiêm trọng từ phía TicketFlix: sẽ được xử lý theo từng trường hợp cụ thể.\n\nMọi yêu cầu hoàn vé cần được gửi trong vòng 48 giờ từ khi phát sinh sự cố.`,
  },
  {
    title: "6. Sở hữu trí tuệ",
    content: `Tất cả nội dung trên TicketFlix bao gồm logo, giao diện, mã nguồn, và dữ liệu đều là tài sản độc quyền của TicketFlix hoặc các đối tác có thẩm quyền. Nghiêm cấm sao chép, phân phối, hoặc sử dụng vì mục đích thương mại mà không có sự cho phép bằng văn bản.`,
  },
  {
    title: "7. Giới hạn trách nhiệm",
    content: `TicketFlix không chịu trách nhiệm về:\n• Thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả phát sinh từ việc sử dụng Dịch vụ.\n• Gián đoạn dịch vụ do sự kiện bất khả kháng.\n• Hành vi của các bên thứ ba bao gồm rạp chiếu phim đối tác.\n\nTrách nhiệm tối đa của TicketFlix không vượt quá giá trị giao dịch liên quan.`,
  },
  {
    title: "8. Thay đổi điều khoản",
    content: `Chúng tôi có quyền cập nhật Điều khoản Sử dụng này bất kỳ lúc nào. Thay đổi có hiệu lực ngay khi đăng tải. Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.\n\nChúng tôi sẽ thông báo về các thay đổi quan trọng qua email đã đăng ký.`,
  },
  {
    title: "9. Luật áp dụng",
    content: `Điều khoản này được điều chỉnh và giải thích theo pháp luật Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh từ hoặc liên quan đến Điều khoản này sẽ được giải quyết tại tòa án có thẩm quyền tại TP. Hồ Chí Minh.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0a1a] via-[#0f0f0f] to-[#0a0f0a] py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.06)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Pháp lý
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Điều khoản sử dụng</h1>
          <p className="mt-3 text-white/40 text-sm">Cập nhật lần cuối: 01/01/2025</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* INTRO */}
        <div className="mb-10 rounded-[20px] border border-yellow-400/20 bg-yellow-400/5 p-6">
          <p className="leading-relaxed text-white/70">
            Chào mừng bạn đến với TicketFlix. Vui lòng đọc kỹ các Điều khoản Sử dụng dưới đây
            trước khi sử dụng dịch vụ của chúng tôi. Điều khoản này tạo thành một thỏa thuận
            pháp lý ràng buộc giữa bạn và TicketFlix.
          </p>
        </div>

        {/* SECTIONS */}
        <div className="space-y-6">
          {SECTIONS.map((sec) => (
            <div
              key={sec.title}
              className="rounded-[20px] border border-white/10 bg-[#111624] p-6 transition hover:border-white/20"
            >
              <h2 className="mb-3 font-bold text-yellow-400">{sec.title}</h2>
              <p className="whitespace-pre-line text-sm leading-7 text-white/60">{sec.content}</p>
            </div>
          ))}
        </div>

        {/* CONTACT NOTE */}
        <div className="mt-10 rounded-[20px] border border-white/10 bg-[#111624] p-6 text-center text-sm text-white/50">
          <p>Nếu có câu hỏi về Điều khoản này, vui lòng liên hệ:</p>
          <p className="mt-1 font-medium text-white">
            📧 legal@ticketflix.me
          </p>
        </div>
      </div>
    </div>
  );
}
