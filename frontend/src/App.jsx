import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";
import LightRays from "./components/LightRays";

import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Account from "./pages/Account";
import Movie from "./pages/Movie";
import TicketBooking from "./pages/TicketBooking";
import CinemaNews from "./pages/CinemaNews";
import NewsDetail from "./pages/NewsDetail";
import Tickets from "./pages/Tickets";
import PaymentPage from "./pages/PaymentPage";
import MyTicketDetail from "./pages/MyTicketDetail";
import ProfilePage from "./pages/ProfilePage";
import PaymentResult from "./pages/PaymentResult";
import Favorites from "./pages/Favorites";

// Footer pages
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PaymentPolicy from "./pages/PaymentPolicy";

import { useTheme } from "./context/ThemeContext";

function App() {
  const { isDark } = useTheme();

  return (
    <BrowserRouter>
      <div
        className={`relative z-10 min-h-screen transition-colors duration-300 ${
          isDark ? "text-white bg-black" : "text-gray-900 bg-white"
        }`}
      >
        {isDark && (
          <div className="fixed inset-0 z-0 pointer-events-none">
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1}
              lightSpread={0.6}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.1}
            />
          </div>
        )}

        <Header />

        <main className="relative z-5 pt-20 md:pt-15">
          <Routes>
            {/* Core */}
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/movie/ticketbooking/:id" element={<TicketBooking />} />
            <Route path="/ticket" element={<Tickets />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/news" element={<CinemaNews />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/my-ticket-detail" element={<MyTicketDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/payment-result" element={<PaymentResult />} />

            {/* Footer — Giới thiệu */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />

            {/* Footer — Hỗ trợ */}
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Footer — Điều khoản */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/payment-policy" element={<PaymentPolicy />} />
          </Routes>
        </main>

        <Footer />
        <FloatingContact />
      </div>
    </BrowserRouter>
  );
}

export default App;
