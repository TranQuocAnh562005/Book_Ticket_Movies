import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const footerLinkClass =
  "transition-colors duration-300 hover:text-yellow-400";

const FOOTER_LINKS = {
  intro: [
    { label: "About Us", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Tuyển dụng", to: "/careers" },
  ],
  support: [
    { label: "Trung tâm trợ giúp", to: "/help-center" },
    { label: "Liên hệ", to: "/contact" },
    { label: "Câu hỏi thường gặp", to: "/faq" },
  ],
  legal: [
    { label: "Điều khoản sử dụng", to: "/terms" },
    { label: "Chính sách bảo mật", to: "/privacy-policy" },
    { label: "Quy định thanh toán", to: "/payment-policy" },
  ],
};

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-yellow-400 font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className={footerLinkClass}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-300 mt-10 border-t border-yellow-500">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">

        {/* LOGO + DESC */}
        <div className="md:w-1/3">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="logo" className="w-16 h-16 object-contain" />
            <span className="text-2xl font-semibold text-white">TicketFlix</span>
          </div>
          <p className="text-sm leading-6 text-gray-400">
            TicketFlix là nền tảng đặt vé xem phim trực tuyến giúp bạn dễ dàng tìm
            kiếm lịch chiếu, lựa chọn rạp và đặt vé nhanh chóng chỉ trong vài
            bước. Chúng tôi mang đến trải nghiệm giải trí tiện lợi, hiện đại
            và an toàn cho mọi tín đồ điện ảnh.
          </p>
        </div>

        {/* COLUMNS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
          <FooterColumn title="Giới thiệu" links={FOOTER_LINKS.intro} />
          <FooterColumn title="Hỗ trợ" links={FOOTER_LINKS.support} />
          <FooterColumn title="Điều khoản" links={FOOTER_LINKS.legal} />
        </div>
      </div>

      {/* SOCIAL + CONTACT */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

          <div>
            <span className="text-yellow-400">Địa chỉ:</span> 12 Nguyễn Văn
            Bảo, Quận Gò Vấp, TP.HCM
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-yellow-400 hover:text-black"
            >
              f
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-yellow-400 hover:text-black"
            >
              X
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-yellow-400 hover:text-black"
            >
              ▶
            </a>
          </div>

          <div>
            <span className="text-yellow-400">Email:</span> adam@gmail.com
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-xs text-gray-500 pb-4">
        ticketflix.me
      </div>
    </footer>
  );
}

export default Footer;
