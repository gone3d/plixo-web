import { Icon } from "../components/atoms";
import { ProjectCard } from "../components/molecules";
import { projects } from "../config/temp-data";

const Work = () => {
  // Get featured projects sorted by priority
  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6); // Show top 6 featured projects

  return (
    <div className="relative min-h-full text-white overflow-y-auto">
      <div className="relative z-10 max-w-6xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            The Work
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A showcase of technical leadership, innovative solutions, and
            hands-on engineering across various domains.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              technologies={project.technologies
                .filter((tech) => tech.primary)
                .map((tech) => tech.name)}
              status={project.status}
              image={project.images.thumbnail}
              liveUrl={project.urls.live}
              githubUrl={project.urls.github}
              demoUrl={project.urls.demo}
              featured={project.featured}
            />
          ))}
        </div>

        {/* Skills Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8">Technology Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-800/30">
              <Icon
                name="work"
                size="xl"
                className="text-blue-400 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">
                Architecture & Design
              </h3>
              <p className="text-slate-300">
                Designing scalable systems that grow with business needs while
                maintaining performance and reliability.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/30">
              <Icon
                name="user"
                size="xl"
                className="text-purple-400 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">Team Leadership</h3>
              <p className="text-slate-300">
                Mentoring engineers, establishing best practices, and fostering
                collaborative development cultures.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/30">
              <Icon
                name="gamepad"
                size="xl"
                className="text-cyan-400 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-slate-300">
                Bringing gaming-inspired problem-solving and creative thinking
                to enterprise challenges.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Work;
