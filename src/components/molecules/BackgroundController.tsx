import { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useGlobal } from "../../contexts/GlobalContext";

interface BackgroundControllerProps {
  className?: string;
}

const BackgroundController = ({
  className = "",
}: BackgroundControllerProps) => {
  const { state, actions } = useGlobal();
  const [showInfo, setShowInfo] = useState(false);

  // Get current image info
  const { currentImageIndex } = state.background;
  const { backgroundImages } = state.data;
  const totalImages = backgroundImages.length;
  const currentImage = backgroundImages[currentImageIndex];

  const handlePrevious = () => {
    const newIndex =
      currentImageIndex === 0 ? totalImages - 1 : currentImageIndex - 1;
    actions.setBackgroundIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentImageIndex + 1) % totalImages;
    actions.setBackgroundIndex(newIndex);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  if (!backgroundImages.length) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 ${className}`}
      style={{ zIndex: 100 }}
    >
      {/* Info Panel - Shows above controller when toggled */}
      {showInfo && currentImage && (
        <div className="mb-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-lg p-4 shadow-xl max-w-sm font-sans">
          <div className="space-y-2">
            {/* Image Title */}
            <h3 className="text-white font-semibold text-sm">
              {currentImage.title || "Untitled"}
            </h3>

            {/* Image Description */}
            {currentImage.description && (
              <p className="text-slate-300 text-xs">
                {currentImage.description}
              </p>
            )}

            {/* NASA APOD Attribution */}
            <div className="pt-2 mt-2 border-t border-slate-700/50">
              <p className="text-slate-400 text-xs">
                All images are from{" "}
                <a
                  href="https://apod.nasa.gov/apod/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  NASA's Astronomy Picture of the Day
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controller Bar */}
      <div className="flex items-center gap-2 bg-slate-900/25 backdrop-blur-md border border-slate-700/50 rounded-lg px-3 py-2 shadow-lg">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="text-white/70 hover:text-white transition-colors p-1 hover:bg-slate-800/50 rounded"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Image Counter */}
        <div className="text-white/70 text-xl font-sans px-2 select-none min-w-[120px] text-center">
          <span className="font-bold">{currentImageIndex + 1}</span> of{" "}
          <span className="font-bold">{totalImages}</span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="text-white/70 hover:text-white transition-colors p-1 hover:bg-slate-800/50 rounded"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-700/50" />

        {/* Info Button */}
        <button
          onClick={toggleInfo}
          className={`transition-colors p-1 rounded ${
            showInfo
              ? "text-blue-400 bg-slate-800/50"
              : "text-white/70 hover:text-white hover:bg-slate-800/50"
          }`}
          aria-label="Toggle image information"
        >
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default BackgroundController;
