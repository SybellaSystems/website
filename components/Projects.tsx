"use client";
import { useEffect, useState } from "react";
import { Rocket, ExternalLink } from "lucide-react";
import { logger } from "../lib/logger";
import { useI18n } from "../contexts/I18nContext";
import { toast } from "sonner";
import Loader from "./Loader";

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

    toast.success(`Thank you for your interest in ${title}!`, {
      description: "We'll notify you soon.",
    });
  };

  if (loading) {
    return (
      <section className="py-16 text-center text-white">
        <Loader size="lg" text="Loading projects..." />
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
      className="relative overflow-hidden border-t border-dim py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_65%)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/window.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "420px auto",
          backgroundPosition: "center top",
          opacity: 0.6,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-14">
          <div className="tag mx-auto mb-5 w-fit">Projects</div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            {t("projects.intro.title")}
          </h2>
        </div>

        <h2 className="sr-only">
          {t("projects.intro.title")}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card relative overflow-hidden p-6 md:p-7 flex flex-col transition-all duration-300"
            >
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_55%)] pointer-events-none" />
              {/* Icon */}
              <div className="relative flex justify-center mb-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-md bg-[var(--blue-dim)] border border-[rgba(59,130,246,0.28)]">
                  <Rocket className="w-7 h-7 text-[var(--blue-bright)]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="relative text-xl md:text-2xl font-semibold text-primary mb-3 text-center">
                {project.title}
              </h3>

              {/* Overview */}
              <p className="relative text-secondary mb-4 text-sm md:text-base text-center">
                {project.overview}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {(project.techStack || []).map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[var(--blue-dim)] text-[var(--blue-bright)] px-2.5 py-1 rounded-full border border-[rgba(59,130,246,0.2)]"
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
                  className="inline-flex items-center justify-center text-sm font-medium text-[var(--blue-bright)] hover:underline mb-4"
                >
                  {t("projects.learnMore")}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              )}

              {/* Button */}
              <div className="mt-auto text-center">
                <button
                  onClick={() => handleEarlyAccessClick(project.title)}
                  className="btn-primary"
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
