import { useState, useEffect } from "react";
import { ProjectCard } from "../components/molecules";
import { LoadingSpinner } from "../components/atoms";

interface WorkProject {
  title: string;
  description: string;
  technologies: string[];
  status: "Live" | "Demo" | "In Development" | "Archived" | "Prototype";
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

const Work = () => {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/config/work-projects.json");
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner variant="primary" size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {/* Projects Display */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                status={project.status}
                image={project.image}
                liveUrl={project.liveUrl}
                githubUrl={project.githubUrl}
                demoUrl={project.demoUrl}
                featured={project.featured}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Work;
