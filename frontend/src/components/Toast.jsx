import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: "bg-green-500/20 border-green-400/40 text-green-100",
  error: "bg-red-500/20 border-red-400/40 text-red-100",
  warning: "bg-yellow-500/20 border-yellow-400/40 text-yellow-100",
  info: "bg-blue-500/20 border-blue-400/40 text-blue-100",
};

const ICON_COLORS = {
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-yellow-400",
  info: "text-blue-400",
};

function ToastItem({ toast, onRemove }) {
  const Icon = ICONS[toast.type] || ICONS.info;
  const style = STYLES[toast.type] || STYLES.info;
  const iconColor = ICON_COLORS[toast.type] || ICON_COLORS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md
                  shadow-2xl max-w-xs w-full pointer-events-auto ${style}`}
    >
      <Icon className={`flex-shrink-0 w-5 h-5 mt-0.5 ${iconColor}`} />
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
