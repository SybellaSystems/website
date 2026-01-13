"use client";
import { useEffect, useState } from "react";
import { Rocket, ExternalLink } from "lucide-react";
import { logger } from "../lib/logger";
import { useI18n } from "../contexts/I18nContext";

type ProjectFromAPI = {
  id: string;
  title: string;
  overview: string;
  image?: string;
  problemSolved?: string;
  techStack: string[];
  partners?: string[];
  callToAction?: string;
  isActive?: boolean;
  demoLink?: string;
  createdAt?: string;
  updatedAt?: string;
};

const Projects = () => {
  const { t } = useI18n();
  const [projects, setProjects] = useState<ProjectFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        logger.info("Fetching projects from API", { endpoint: "/api/projects" });
        const res = await fetch("/api/projects");

        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

        const data = await res.json();
        setProjects(Array.isArray(data) ? data : [data]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load projects.");
        logger.error("Project fetch failed", { error: err });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleEarlyAccessClick = (title: string): void => {
    logger.userInteraction("Early access button clicked", {
      action: "request_early_access",
      project: title,
    });

    alert(`Thank you for your interest in ${title}! We'll notify you soon.`);
  };

  if (loading) {
    return (
      <section className="py-16 text-center text-white">
        <p>Loading projects...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center text-red-400">
        <p>Error: {error}</p>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="py-16 bg-dark-blue dark:bg-dark-surface relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-dark-blue/40 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-12">
          {t("projects.intro.title")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative rounded-2xl shadow-xl p-8 bg-gradient-to-r from-green-400 to-yellow-400 transform hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <Rocket className="w-12 h-12 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4">
                {project.title}
              </h3>

              {/* Overview */}
              <p className="text-white/90 mb-4">{project.overview}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Demo link */}
              {project.demoLink && (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-white hover:underline mb-4"
                >
                  {t("projects.learnMore")}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              )}

              {/* Button */}
              <div>
                <button
                  onClick={() => handleEarlyAccessClick(project.title)}
                  className="px-8 py-3 bg-dark-blue text-white font-semibold rounded-xl shadow-lg hover:bg-dark-blue/90 transition"
                >
                  {project.callToAction || t("projects.requestAccess")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
