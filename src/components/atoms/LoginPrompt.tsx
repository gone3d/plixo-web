import { ChevronRight } from "lucide-react";

interface LoginPromptProps {
  className?: string;
}

const LoginPrompt = ({ className = "" }: LoginPromptProps) => {
  return (
    <div
      className={`flex items-center gap-2 text-cyan-400 text-lg font-semibold ${className}`}
      style={{
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    >
      <span className="whitespace-nowrap">Click to enter</span>
      <ChevronRight
        className="w-5 h-5"
        style={{
          animation: "bounce-x 1s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPrompt;
