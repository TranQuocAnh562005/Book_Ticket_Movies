import { useState } from "react";
import { Link } from "react-router-dom";

const FAQ_DATA = {
  "Đặt vé": [
    {
      q: "Tôi có thể đặt vé trước bao lâu?",
      a: "Bạn có thể đặt vé trước tối đa 7 ngày so với ngày chiếu. Lịch chiếu được cập nhật hàng ngày và thường mở bán từ 10:00 sáng.",
    },
    {
      q: "Có giới hạn số lượng vé mỗi lần đặt không?",
      a: "Mỗi giao dịch, bạn có thể đặt tối đa 8 ghế. Nếu cần đặt nhiều hơn, vui lòng thực hiện nhiều giao dịch hoặc liên hệ hỗ trợ.",
    },
    {
      q: "Vé điện tử được gửi qua đâu?",
      a: "Vé điện tử hiển thị trực tiếp trong tài khoản TicketFlix tại mục 'Vé của tôi', kèm mã QR để quét tại quầy rạp.",
    },
    {
      q: "Tôi có thể đặt vé mà không cần tài khoản không?",
      a: "Hiện tại cần đăng nhập để đặt vé nhằm đảm bảo an toàn và tiện lợi trong quản lý vé. Đăng ký hoàn toàn miễn phí.",
    },
    {
      q: "Vé đặt thành công sẽ xuất hiện ngay không?",
      a: "Có. Sau khi thanh toán thành công, vé sẽ xuất hiện ngay lập tức trong mục 'Vé của tôi' kèm mã QR.",
    },
  ],
  "Thanh toán": [
    {
      q: "TicketFlix hỗ trợ những phương thức thanh toán nào?",
      a: "Chúng tôi hỗ trợ: MoMo, ZaloPay, Visa/Mastercard và các thẻ ATM nội địa qua cổng thanh toán an toàn.",
    },
    {
      q: "Tôi có thể hoàn tiền sau khi thanh toán không?",
      a: "Theo chính sách hiện tại, vé đã thanh toán không được hoàn tiền. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đặt vé.",
    },
    {
      q: "Thanh toán thất bại nhưng tiền vẫn bị trừ?",
      a: "Trong trường hợp này, tiền sẽ được hoàn tự động trong vòng 3–7 ngày làm việc. Liên hệ hotline để được hỗ trợ xử lý nhanh hơn.",
    },
    {
      q: "Giao dịch có được mã hóa an toàn không?",
      a: "Tất cả giao dịch đều được mã hóa SSL/TLS 256-bit. Thông tin thẻ của bạn không được lưu trữ trên hệ thống TicketFlix.",
    },
  ],
  "Tài khoản": [
    {
      q: "Làm sao để đăng ký tài khoản?",
      a: "Truy cập mục 'Tài khoản' → 'Đăng ký', điền thông tin cá nhân và xác nhận qua email. Hoặc đăng nhập nhanh bằng Google.",
    },
    {
      q: "Tôi quên mật khẩu phải làm sao?",
      a: "Nhấn 'Quên mật khẩu' tại trang đăng nhập, nhập email và chúng tôi sẽ gửi liên kết đặt lại trong vòng 5 phút.",
    },
    {
      q: "Có thể đăng nhập bằng Google không?",
      a: "Có! TicketFlix hỗ trợ đăng nhập nhanh qua Google OAuth. Chỉ cần 1 click, không cần nhớ mật khẩu.",
    },
    {
      q: "Làm sao để thay đổi thông tin cá nhân?",
      a: "Đăng nhập → vào 'Hồ sơ cá nhân' → chỉnh sửa thông tin và lưu lại. Một số thông tin có thể cần xác nhận email.",
    },
  ],
  "Ghế & Rạp": [
    {
      q: "Ghế tôi đã chọn có thể bị người khác lấy không?",
      a: "Khi đang chọn ghế, ghế được giữ tạm thời 10 phút cho bạn. Sau khi thanh toán thành công, ghế chính thức thuộc về bạn.",
    },
    {
      q: "Sự khác biệt giữa các loại ghế là gì?",
      a: "Ghế Thường (Standard): giá cơ bản. Ghế VIP: rộng hơn, vị trí trung tâm, giá cao hơn. Ghế Đôi (Couple): dành cho 2 người, được bố trí đặc biệt.",
    },
    {
      q: "Có thể đổi ghế sau khi đã đặt không?",
      a: "Hiện tại không hỗ trợ đổi ghế sau khi thanh toán. Vui lòng kiểm tra kỹ trước khi xác nhận.",
    },
    {
      q: "Rạp chiếu ở đâu có dùng TicketFlix được?",
      a: "TicketFlix đang hợp tác với hơn 50 rạp tại TP.HCM, Hà Nội và nhiều tỉnh thành khác. Danh sách cập nhật tại trang đặt vé.",
    },
  ],
};

function AccordionItem({ q, a, isOpen, onClick }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#111624] transition hover:border-yellow-400/30">
      <button
        onClick={onClick}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium leading-relaxed">{q}</span>
        <span
          className={`mt-0.5 shrink-0 text-2xl leading-none text-yellow-400 transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-48" : "max-h-0"
        }`}
      >
        <p className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-white/60">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const categories = Object.keys(FAQ_DATA);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [openIndex, setOpenIndex] = useState(null);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setOpenIndex(null);
  };

  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a1a] via-[#0f0f0f] to-[#1a1000] py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-400">
            FAQ
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Câu hỏi thường gặp
          </h1>
          <p className="mt-4 text-white/50">
            Tìm câu trả lời nhanh cho những thắc mắc phổ biến nhất về TicketFlix
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* CATEGORY TABS */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                  : "border border-white/10 bg-[#111624] text-white/60 hover:border-yellow-400/40 hover:text-white"
              }`}
            >
              {cat}
              <span
                className={`ml-2 text-xs ${
                  activeCategory === cat ? "text-black/60" : "text-white/30"
                }`}
              >
                {FAQ_DATA[cat].length}
              </span>
            </button>
          ))}
        </div>

        {/* ACCORDION */}
        <div className="space-y-3">
          {FAQ_DATA[activeCategory].map((item, i) => (
            <AccordionItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-[24px] border border-white/10 bg-[#111624] p-8 text-center">
          <div className="text-3xl mb-3">🤔</div>
          <h2 className="text-lg font-bold">Vẫn chưa tìm được câu trả lời?</h2>
          <p className="mt-2 text-sm text-white/50">
            Đội ngũ hỗ trợ TicketFlix luôn sẵn sàng giải đáp mọi thắc mắc của bạn.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              Liên hệ hỗ trợ
            </Link>
            <Link
              to="/help-center"
              className="rounded-xl border border-white/20 px-6 py-2.5 text-sm font-semibold transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Trung tâm trợ giúp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
