import { Icon, BackgroundSlideshow } from '../components/atoms'

const backgroundImages = [
  { filename: 'astronomyBG1.jpg' },
  { filename: 'astronomyBG2.jpg' }
]

const Work = () => {
  const projects = [
    {
      title: 'Enterprise SaaS Platform',
      description: 'Led the architecture and development of a multi-tenant SaaS platform serving 100k+ users',
      tech: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      status: 'Live',
      link: '#'
    },
    {
      title: 'Real-time Analytics Dashboard',
      description: 'Built high-performance dashboard processing millions of events per day',
      tech: ['TypeScript', 'D3.js', 'WebSocket', 'Redis'],
      status: 'Live',
      link: '#'
    },
    {
      title: 'Roguelike Game Engine',
      description: 'Personal project: Classic roguelike game with modern web technologies',
      tech: ['JavaScript', 'Canvas API', 'Game Logic'],
      status: 'Demo',
      link: '#'
    },
    {
      title: 'Microservices Architecture',
      description: 'Designed and implemented scalable microservices architecture for fintech startup',
      tech: ['Docker', 'Kubernetes', 'Go', 'gRPC'],
      status: 'Live',
      link: '#'
    }
  ]

  return (
    <div className="relative h-full text-white overflow-y-auto">
      <BackgroundSlideshow
        images={backgroundImages}
        transitionTime={18000}
        showOverlay={true}
        displayMode="slide"
      />
      <div className="relative z-10 max-w-6xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            My Work
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A showcase of technical leadership, innovative solutions, and hands-on engineering across various domains.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'Live'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-slate-300 mb-6">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm bg-slate-700 text-slate-200 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                View Project
                <Icon name="external" size="sm" />
              </a>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8">Technology Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-800/30">
              <Icon name="work" size="xl" className="text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Architecture & Design</h3>
              <p className="text-slate-300">
                Designing scalable systems that grow with business needs while maintaining performance and reliability.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/30">
              <Icon name="user" size="xl" className="text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Team Leadership</h3>
              <p className="text-slate-300">
                Mentoring engineers, establishing best practices, and fostering collaborative development cultures.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/30">
              <Icon name="gamepad" size="xl" className="text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-slate-300">
                Bringing gaming-inspired problem-solving and creative thinking to enterprise challenges.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Work