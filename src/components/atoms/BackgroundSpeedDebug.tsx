import { Activity } from "lucide-react";
import { useGlobal } from "../../contexts/GlobalContext";

const BackgroundSpeedDebug = () => {
  const { state } = useGlobal();
  const { speedPxPerSec, direction } = state.backgroundAnimation;

  // Show 'x' for horizontal, 'y' for vertical, '-' for none
  const axis = direction === 'horizontal' ? 'x' : direction === 'vertical' ? 'y' : '-';

  return (
    <div
      className="fixed left-4 bottom-4 text-white font-mono text-sm z-50 flex items-center gap-1"
      style={{ textShadow: "0 0 4px rgba(0,0,0,0.8)" }}
    >
      <Activity className="w-4 h-4 text-cyan-400" />
      <span className="text-cyan-400">{Math.round(speedPxPerSec)}</span>
      <span className="text-slate-400">{axis}</span>
    </div>
  );
};

export default BackgroundSpeedDebug;
