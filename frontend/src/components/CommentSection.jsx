import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Trash2, Star, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = (type, id) => `comments_${type}_${id}`;

function getInitials(name = "") {
  return name
    .split(" ")
    .map(w => w[0])
    .slice(-2)
    .join("")
    .toUpperCase() || "?";
}

function formatRelativeDate(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "vừa xong";
  if (mins  < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days  < 30) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star === value ? 0 : star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-transform ${readOnly ? "cursor-default" : "hover:scale-125 cursor-pointer"}`}
        >
          <Star
            className={`w-4 h-4 ${
              star <= (hovered || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function CommentItem({ comment, currentUserId, onDelete }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      className="flex gap-3 group"
    >
      {/* Avatar */}
      {comment.userAvatar ? (
        <img
          src={comment.userAvatar}
          alt={comment.userName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-yellow-400/20"
        />
      ) : (
        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center
                        bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-xs font-bold
                        ring-2 ring-yellow-400/20">
          {getInitials(comment.userName)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 dark:bg-white/5 rounded-2xl rounded-tl-none px-4 py-3
                        border border-gray-200 dark:border-white/5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {comment.userName}
            </span>
            {comment.userId === currentUserId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity
                           p-1 rounded-lg text-red-400 hover:bg-red-400/10"
                title="Xoá bình luận"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {comment.rating > 0 && (
            <div className="mb-1.5">
              <StarRating value={comment.rating} readOnly />
            </div>
          )}

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {comment.text}
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-1">
          {formatRelativeDate(comment.date)}
        </p>
      </div>
    </Motion.div>
  );
}

export default function CommentSection({ id, type = "movie", withRating = false }) {
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState("");
  const [rating, setRating]     = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const storageKey = STORAGE_KEY(type, id);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setComments(Array.isArray(saved) ? saved : []);
    } catch {
      setComments([]);
    }
  }, [storageKey]);

  const persist = useCallback((list) => {
    localStorage.setItem(storageKey, JSON.stringify(list));
  }, [storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !isLoggedIn) return;

    setSubmitting(true);
    const newComment = {
      id: `${Date.now()}-${Math.random()}`,
      userId: user._id || user.email,
      userName: user.fullName || user.email?.split("@")[0] || "Ẩn danh",
      userAvatar: user.avatar || null,
      text: text.trim(),
      rating: withRating ? rating : 0,
      date: new Date().toISOString(),
    };

    setTimeout(() => {
      const updated = [newComment, ...comments];
      setComments(updated);
      persist(updated);
      setText("");
      setRating(0);
      setSubmitting(false);
    }, 200);
  };

  const handleDelete = (commentId) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    persist(updated);
  };

  const currentUserId = user ? (user._id || user.email) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Bình luận
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({comments.length})</span>
          )}
        </h3>
      </div>

      {/* Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-yellow-400/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center
                              bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-xs font-bold
                              ring-2 ring-yellow-400/30">
                {getInitials(user?.fullName)}
              </div>
            )}
            <div className="flex-1 space-y-2">
              {withRating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Đánh giá:</span>
                  <StarRating value={rating} onChange={setRating} />
                  {rating > 0 && (
                    <button
                      type="button"
                      onClick={() => setRating(0)}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Bỏ chọn
                    </button>
                  )}
                </div>
              )}
              <div className="relative">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={`Chia sẻ suy nghĩ của bạn về ${type === "movie" ? "bộ phim" : "bài viết"} này...`}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl rounded-tl-none text-sm resize-none
                             bg-gray-100 dark:bg-white/5
                             border border-gray-200 dark:border-white/10
                             text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:border-yellow-400/60
                             transition-colors"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || submitting}
                  className="absolute bottom-3 right-3 p-2 rounded-xl
                             bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 dark:disabled:bg-white/10
                             text-black disabled:text-gray-400 dark:disabled:text-gray-600
                             transition-all disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-2xl
                        bg-gray-100 dark:bg-white/5
                        border border-gray-200 dark:border-white/10">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Đăng nhập để tham gia bình luận
          </p>
          <Link
            to="/account"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                       bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold transition"
          >
            <LogIn className="w-4 h-4" />
            Đăng nhập
          </Link>
        </div>
      )}

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-10">
          <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chưa có bình luận. Hãy là người đầu tiên!
          </p>
        </div>
      )}
    </div>
  );
}
