import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ size = "md", showLabel = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeMap = {
    sm: "p-1.5 rounded-lg",
    md: "p-2 rounded-xl",
    lg: "p-2.5 rounded-xl",
  };
  const iconMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      className={`flex items-center gap-2 transition-all duration-200 ${sizeMap[size]}
                  ${isDark
                    ? "bg-white/10 hover:bg-white/20 text-yellow-300"
                    : "bg-gray-100 hover:bg-gray-200 text-indigo-600 border border-gray-200"
                  }`}
    >
      {isDark ? (
        <Sun className={iconMap[size]} />
      ) : (
        <Moon className={iconMap[size]} />
      )}
      {showLabel && (
        <span className="text-sm font-medium whitespace-nowrap">
          {isDark ? "Sáng" : "Tối"}
        </span>
      )}
    </button>
  );
}
