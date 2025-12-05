import { useState, useEffect } from "react";
import { ProjectCard } from "../components/molecules";
import { LoadingSpinner } from "../components/atoms";
import { apiClient } from "../services/api";

interface WorkProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: "Live" | "Demo" | "In Development" | "Archived" | "Prototype";
  image?: string;
  live_url?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  featured?: boolean;
}

const Work = () => {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await apiClient.get("/projects");

        if (data.success && data.data) {
          setProjects(data.data);
        } else {
          setError(data.error || "Failed to load projects");
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } }; message?: string };
        setError(error.response?.data?.error || error.message || "Failed to load projects");
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
          <>
            {projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-xl">No Projects Currently Available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    technologies={project.technologies}
                    status={project.status}
                    image={project.image}
                    liveUrl={project.live_url || undefined}
                    githubUrl={project.github_url || undefined}
                    demoUrl={project.demo_url || undefined}
                    featured={project.featured}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Work;
