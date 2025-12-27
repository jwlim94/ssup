"use client";

interface AlertProps {
  message: string;
  variant?: "error" | "success" | "warning" | "info";
  className?: string;
}

const variants = {
  error: {
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-600",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  success: {
    bg: "bg-green-500/10 border-green-500/20",
    text: "text-green-600",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  warning: {
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-600",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  info: {
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-600",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

export function Alert({
  message,
  variant = "error",
  className = "",
}: AlertProps) {
  const style = variants[variant];

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200 ${style.bg} ${className}`}
    >
      <span className={style.text}>{style.icon}</span>
      <p className={`text-sm font-medium ${style.text}`}>{message}</p>
    </div>
  );
}
