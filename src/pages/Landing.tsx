import { BackgroundSlideshow } from "../components/molecules";

const backgroundImages = [
  { filename: "astronomyBG1.jpg" },
  { filename: "astronomyBG2.jpg" },
];

const Landing = () => {
  return (
    <div className="relative h-full overflow-hidden text-white">
      <BackgroundSlideshow
        images={backgroundImages}
        transitionTime={15000}
        displayMode="slide"
      />
      {/* Hero Section */}
      <section className="flex items-center justify-center h-full px-4">
        <div className="text-center space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              Don
            </h1>
            <h2 className="text-lg md:text-xl text-white/90 font-light">
              Staff Engineer/Engineering Manager
            </h2>
          </div>

          {/* Subtle CTA */}
          <div className="mt-12 opacity-75">
            <a
              href="/work"
              className="text-white/80 hover:text-white border-b border-white/30 hover:border-white transition-colors pb-1 text-sm"
            >
              View Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
