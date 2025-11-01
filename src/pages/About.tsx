
const About = () => {
  return (
    <div className="relative min-h-full text-white overflow-y-auto">
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
              My career has spanned research laboratories, defense contractors,
              and enterprise technology leadership. With a Computer Science
              foundation in 3D animation and visualization, I started with
              satellite image processing at NASA's Jet Propulsion Laboratory,
              then advanced to BAE Systems where I architected everything from
              HAARP antenna control systems to hyperspectral imaging tools and
              directed energy platforms.
            </p>
            <p>
              The transition to enterprise software brought leadership roles in
              interactive media and streaming video platforms, culminating in
              engineering management at Capital One where I led teams through
              complex migrations from legacy systems to modern cloud
              architectures. Today, I architect AI-integrated applications and
              develop frameworks for LLM-augmented development workflows.
            </p>
            <p>
              Throughout this progression, the pattern has remained consistent:
              identify emerging technologies, extract practical value, and build
              solutions that engineering teams can maintain and extend. Whether
              migrating government training systems from Flash to VR, deploying
              custom AI models, or architecting streaming platforms, the focus
              stays on sustainable, scalable implementations.
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
