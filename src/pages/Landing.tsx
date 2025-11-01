import packageJson from "../../package.json";

const Landing = () => {
  return (
    <div className="relative min-h-full overflow-hidden text-white">
      {/* Hero Section */}
      <section
        className="flex items-center justify-center min-h-screen px-4"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="text-center space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              Don
            </h1>
            <h2 className="text-lg md:text-xl text-white/90 font-light">
              Staff Engineer/Engineering Manager/Diginaut
            </h2>
          </div>

          {/* Work in Progress Notice */}
          <div className="mt-8">
            <p className="text-white/60 text-sm italic">
              A Continuously Evolving Work in Progress
            </p>
            <p className="text-white/40 text-xs mt-1">v{packageJson.version}</p>
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
