
const About = () => {
  return (
    <div className="relative h-full text-white overflow-y-auto">
      <div className="relative z-10 max-w-3xl mx-auto py-20 px-4">
        {/* Header */}
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About
          </h1>
        </div>

        {/* Content */}
        <div className="bg-black/40 p-4 backdrop-blur-sm rounded-lg">
          <div className="space-y-8 text-slate-300 leading-relaxed ">
            <p>
              I didn't know what I wanted to be when I grew up and I'm still
              trying to find out. Studied Computer Science with a focus on 3D
              Animation, did satellite image processing at NASA/JPL, spent some
              time at BAE Systems Advanced Power Technologies doing weird
              science building everything from HAARP antenna control systems,
              hyperspectral imagery tools and power beaming.
            </p>
            <p>
              Moved into interactive media when Flash was king, helped Echo360
              build educational video platforms, led teams at Capital One
              migrating from legacy systems to modern cloud architectures.
              Currently architecting AI-integrated applications and exploring
              how LLMs can augment development workflows.
            </p>
            <p>
              Consider myself a Diginaut - exploring all things digital. Whether
              it's migrating government training from Flash to VR, building
              streaming video players, or deploying custom AI models, the
              curiosity remains constant. Most technical problems are variations
              on themes, but finding elegant implementations that teams can
              actually maintain - that's the interesting part.
            </p>
            <p>
              These days I focus on building systems that scale gracefully and
              teams that ship consistently. The technology changes, but good
              engineering principles endure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
