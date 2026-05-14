import { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { updateProfileApi } from "../services/auth";
import { getMyBookings } from "../services/bookings";
import { getFavorites } from "../services/favorites";

// ── Variants ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" },
  }),
};

// ── Avatar component ──────────────────────────────────────
function AvatarCircle({ user, size = 96, onClick, uploading }) {
  const initials = user?.fullName
    ? user.fullName.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase()
    : "?";

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group"
      onClick={onClick}
      title="Nhấn để đổi ảnh đại diện"
      style={{ width: size, height: size }}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.fullName}
          className="rounded-full object-cover ring-4 ring-yellow-400/60 shadow-xl w-full h-full"
        />
      ) : (
        <div
          className="rounded-full ring-4 ring-yellow-400/60 shadow-xl flex items-center
                     justify-center bg-gradient-to-br from-indigo-600 to-purple-700
                     text-white font-bold w-full h-full"
          style={{ fontSize: size * 0.36 }}
        >
          {initials}
        </div>
      )}

      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100
                      transition-opacity flex items-center justify-center">
        {uploading ? (
          <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        )}
      </div>

      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0d1b3e] dark:border-[#0d1b3e]" />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ icon, label, value, i }) {
  return (
    <Motion.div
      variants={fadeUp} custom={i} initial="hidden" animate="show"
      className="flex flex-col items-center gap-1 rounded-2xl border
                 border-gray-200 dark:border-white/10
                 bg-gray-50 dark:bg-white/5
                 px-6 py-5
                 hover:border-yellow-400/40 hover:bg-gray-100 dark:hover:bg-white/10
                 transition-all duration-300"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-2xl font-extrabold text-yellow-500 dark:text-yellow-300">{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 tracking-wide">{label}</span>
    </Motion.div>
  );
}

// ── Editable info row ─────────────────────────────────────
function InfoRow({ icon, label, value, editing, onChange, placeholder, readOnly }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border
                    border-gray-200 dark:border-white/10
                    bg-gray-50 dark:bg-white/5
                    px-5 py-4
                    hover:border-yellow-400/20 transition-colors">
      <span className="text-xl w-7 text-center flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">{label}</p>
        {editing && !readOnly ? (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-gray-900 dark:text-white
                       border-b border-yellow-400/50 focus:outline-none focus:border-yellow-400
                       py-0.5 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        ) : (
          <p className={`text-sm font-medium truncate ${value ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500 italic"}`}>
            {value || placeholder}
          </p>
        )}
      </div>
      {readOnly && (
        <span className="text-xs bg-gray-100 dark:bg-white/5 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">
          Cố định
        </span>
      )}
    </div>
  );
}

// ── Theme Toggle Button ───────────────────────────────────
function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                 border border-gray-300 dark:border-white/20
                 bg-gray-100 dark:bg-white/5
                 text-gray-700 dark:text-gray-300
                 hover:border-yellow-400/60 hover:text-yellow-600 dark:hover:text-yellow-400
                 transition-all duration-200 text-sm font-medium"
    >
      {theme === "dark" ? (
        <><Sun className="w-4 h-4" /><span className="hidden sm:inline">Chế độ sáng</span></>
      ) : (
        <><Moon className="w-4 h-4" /><span className="hidden sm:inline">Chế độ tối</span></>
      )}
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, token, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.fullName || "");
  const [editPhone, setEditPhone]       = useState(user?.phone    || "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);

  const [bookingsCount, setBookingsCount]   = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (token) {
      getMyBookings(token)
        .then((data) => {
          if (data && Array.isArray(data)) setBookingsCount(data.length);
          else if (data && Array.isArray(data.bookings)) setBookingsCount(data.bookings.length);
        })
        .catch(() => {});

      getFavorites(token)
        .then((data) => {
          if (data?.favorites) setFavoritesCount(data.favorites.length);
        })
        .catch(() => {});
    }
  }, [token]);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", { year: "numeric", month: "long" })
    : "Mới tham gia";

  const handleAvatarClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { addToast("Chỉ chấp nhận file ảnh", "error"); return; }
    if (file.size > 3 * 1024 * 1024) { addToast("Ảnh phải nhỏ hơn 3MB", "error"); return; }

    setUploading(true);
    try {
      const base64 = await resizeImage(file, 256);
      const result = await updateProfileApi(token, { avatar: base64 });
      updateUser(result.user);
      addToast("Đã cập nhật ảnh đại diện!", "success");
    } catch (err) {
      addToast(err.message || "Upload thất bại", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfileApi(token, {
        fullName: editFullName,
        phone: editPhone,
      });
      updateUser(result.user);
      addToast("Lưu thông tin thành công!", "success");
      setEditing(false);
    } catch (err) {
      addToast(err.message || "Lưu thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFullName(user?.fullName || "");
    setEditPhone(user?.phone || "");
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    addToast("Đã đăng xuất. Hẹn gặp lại bạn!", "info");
    navigate("/");
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 transition-colors duration-300 ${isDark ? "bg-[#060e1f]" : "bg-gray-50"}`}>
      {/* Ambient glow — dark mode only */}
      {isDark && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px]
                          rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px]
                          rounded-full bg-purple-700/10 blur-[100px]" />
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">

        {/* ── Hero card ── */}
        <Motion.div
          variants={fadeUp} custom={0} initial="hidden" animate="show"
          className={`relative overflow-hidden rounded-3xl border shadow-2xl p-8 md:p-10
                      ${isDark
                        ? "border-white/10 bg-gradient-to-br from-[#0d1b3e] via-[#111f4d] to-[#0c2050] shadow-indigo-500/10"
                        : "border-gray-200 bg-white shadow-gray-200/80"
                      }`}
        >
          {isDark && (
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full
                            bg-gradient-to-br from-yellow-400/20 to-indigo-600/10 blur-2xl" />
          )}

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6">
            <AvatarCircle user={user} size={104} onClick={handleAvatarClick} uploading={uploading} />

            <div className="flex-1 text-center md:text-left">
              <h1 className={`text-3xl md:text-4xl font-extrabold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                {user?.fullName || "Người dùng"}
              </h1>
              <p className="mt-1 text-yellow-500 dark:text-yellow-300/80 text-sm">{user?.email}</p>
              <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
                <span className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-indigo-600/50 border border-indigo-400/30 text-indigo-200" : "bg-indigo-100 border border-indigo-200 text-indigo-700"}`}>
                  🎬 Thành viên
                </span>
                <span className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-300" : "bg-yellow-50 border border-yellow-200 text-yellow-700"}`}>
                  ⭐ {joinedDate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap justify-center">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                onClick={() => navigate("/ticket")}
                className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black
                           font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-yellow-500/25"
              >
                🎫 Vé của tôi
              </button>
              <button
                onClick={() => setShowLogout(true)}
                className="px-5 py-2.5 rounded-xl border border-red-500/40 bg-red-500/10
                           hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-all hover:scale-105"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </Motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 max-w-lg mx-auto gap-4">
          {[
            { icon: "🎫", label: "Vé đã đặt",  value: bookingsCount.toString() },
            { icon: "❤️", label: "Yêu thích",   value: favoritesCount.toString() },
          ].map((s, i) => <StatCard key={i} {...s} i={i} />)}
        </div>

        {/* ── Info section ── */}
        <Motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="show"
          className={`rounded-3xl border backdrop-blur-sm p-6 md:p-8 transition-colors
                      ${isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"}`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              <span className="w-1 h-5 rounded-full bg-yellow-400 inline-block" />
              Thông tin tài khoản
            </h2>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all duration-200
                            ${isDark
                              ? "border-white/20 bg-white/5 text-gray-300 hover:text-yellow-400 hover:border-yellow-400/40"
                              : "border-gray-200 bg-gray-50 text-gray-600 hover:text-yellow-600 hover:border-yellow-400/40"
                            }`}
              >
                ✏️ Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className={`px-4 py-2 rounded-xl border text-sm transition
                              ${isDark ? "border-white/20 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black
                             font-semibold text-sm transition disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                  Lưu
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <InfoRow
              icon="👤" label="Họ và tên"
              value={editing ? editFullName : user?.fullName}
              editing={editing} onChange={setEditFullName} placeholder="Chưa cập nhật"
            />
            <InfoRow
              icon="📧" label="Email"
              value={user?.email} editing={false} placeholder="—" readOnly
            />
            <InfoRow
              icon="📱" label="Số điện thoại"
              value={editing ? editPhone : user?.phone}
              editing={editing} onChange={setEditPhone} placeholder="Chưa cập nhật"
            />
            <InfoRow
              icon="🔑" label="Loại tài khoản"
              value={user?.googleId ? "Google Account" : "Email & Mật khẩu"}
              editing={false} readOnly
            />
          </div>
        </Motion.div>

        {/* ── Quick links ── */}
        <Motion.div
          variants={fadeUp} custom={4} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { icon: "🎟️", title: "Vé của tôi",    desc: "Xem tất cả vé đã đặt",           path: "/ticket",    color: isDark ? "from-yellow-500/20 to-orange-500/10 border-yellow-500/20" : "from-yellow-50 to-orange-50 border-yellow-200" },
            { icon: "🎬", title: "Khám phá phim",  desc: "Tìm phim đang chiếu",             path: "/movie",     color: isDark ? "from-indigo-500/20 to-purple-500/10 border-indigo-500/20" : "from-indigo-50 to-purple-50 border-indigo-200" },
            { icon: "❤️", title: "Danh sách yêu thích", desc: "Phim bạn đã lưu lại",       path: "/favorites", color: isDark ? "from-pink-500/20 to-rose-500/10 border-pink-500/20" : "from-pink-50 to-rose-50 border-pink-200" },
            { icon: "📰", title: "Tin tức điện ảnh", desc: "Khám phá tin tức mới nhất",     path: "/news",      color: isDark ? "from-green-500/20 to-teal-500/10 border-green-500/20" : "from-green-50 to-teal-50 border-green-200" },
          ].map((item, i) => (
            <Motion.div key={item.path} variants={fadeUp} custom={i} initial="hidden" animate="show">
              <Link
                to={item.path}
                className={`flex items-center gap-4 rounded-2xl border bg-gradient-to-br
                           ${item.color} p-5 hover:scale-[1.02] transition-all duration-300 group`}
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className={`font-semibold group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400">{item.desc}</p>
                </div>
                <span className={`ml-auto text-lg group-hover:text-yellow-400 transition-colors ${isDark ? "text-gray-500" : "text-gray-400"}`}>→</span>
              </Link>
            </Motion.div>
          ))}
        </Motion.div>
      </div>

      {/* ── Logout modal ── */}
      <AnimatePresence>
        {showLogout && (
          <Motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowLogout(false)}
          >
            <Motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl
                          ${isDark ? "bg-[#0d1b3e] border-white/10" : "bg-white border-gray-200"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">👋</div>
              <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Đăng xuất?</h3>
              <p className="text-gray-400 dark:text-gray-400 text-sm mb-6">
                Bạn sẽ cần đăng nhập lại để đặt vé và xem lịch sử.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogout(false)}
                  className={`flex-1 py-3 rounded-xl border transition
                              ${isDark ? "border-white/20 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Huỷ
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition"
                >
                  Đăng xuất
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Resize ảnh về 256×256, trả base64 ────────────────────
function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      const min = Math.min(img.width, img.height);
      const sx  = (img.width  - min) / 2;
      const sy  = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}
