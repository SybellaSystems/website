"use client";

import {
  FaGraduationCap,
  FaShoppingCart,
  FaHospital,
  FaHotel,
  FaTruck,
  FaWallet,
  FaUsers,
  FaGlobe,
} from "react-icons/fa";
import type { IconType } from "react-icons";

interface Project {
  id: string;
  title: string;
  overview: string;
  category?: string;
  isActive: boolean;
  [key: string]: any;
}

const iconMap: Record<string, IconType> = {
  education: FaGraduationCap,
  business: FaShoppingCart,
  healthcare: FaHospital,
  hospitality: FaHotel,
  transport: FaTruck,
  financial: FaWallet,
  hr: FaUsers,
  government: FaGlobe,
};

// Static projects data
const staticProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    overview: "A comprehensive e-commerce solution with advanced inventory management, payment processing, and customer analytics.",
    category: "business",
    isActive: true,
  },
  {
    id: "2",
    title: "Healthcare Management System",
    overview: "Streamlined healthcare management platform for hospitals and clinics to manage patient records, appointments, and billing.",
    category: "healthcare",
    isActive: true,
  },
  {
    id: "3",
    title: "Learning Management System",
    overview: "Modern LMS platform enabling educational institutions to deliver online courses, track progress, and manage student engagement.",
    category: "education",
    isActive: true,
  },
  {
    id: "4",
    title: "Financial Analytics Dashboard",
    overview: "Real-time financial analytics and reporting dashboard for businesses to track revenue, expenses, and financial KPIs.",
    category: "financial",
    isActive: true,
  },
  {
    id: "5",
    title: "Project Management Tool",
    overview: "Collaborative project management platform with task tracking, team collaboration, and real-time updates.",
    category: "business",
    isActive: true,
  },
  {
    id: "6",
    title: "Customer Relationship Management",
    overview: "Comprehensive CRM solution to manage customer interactions, sales pipelines, and marketing campaigns.",
    category: "business",
    isActive: true,
  },
  {
    id: "7",
    title: "Hotel Booking System",
    overview: "Complete hotel management system for reservations, room management, and guest services.",
    category: "hospitality",
    isActive: true,
  },
  {
    id: "8",
    title: "Transportation Management",
    overview: "Fleet management and logistics platform for tracking vehicles, routes, and deliveries in real-time.",
    category: "transport",
    isActive: true,
  },
  {
    id: "9",
    title: "HR Management System",
    overview: "Human resources platform for employee management, payroll, attendance, and performance tracking.",
    category: "hr",
    isActive: true,
  },
];

export default function ProjectsPage() {
  const projects = staticProjects;

  return (
    <section className="relative overflow-hidden border-t border-dim py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_65%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/globe.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-12 md:mb-14 mt-8 text-center">
          <div className="tag mx-auto mb-5 w-fit">Projects</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Introducing Our Projects
          </h1>
          <p className="text-base md:text-lg text-secondary max-w-3xl mx-auto">
            Explore our latest solutions and innovations built to solve real
            challenges across industries.
          </p>
        </div>

        <div className="relative mb-10 overflow-hidden rounded-md border border-[rgba(59,130,246,0.22)]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/globe.svg')",
              backgroundRepeat: "repeat",
              backgroundSize: "150px 150px",
              opacity: 0.12,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(16,185,129,0.25)] via-[rgba(59,130,246,0.2)] to-[rgba(30,41,59,0.45)]" />
          <div className="relative px-6 py-10 md:px-10 md:py-14 text-center">
            <p className="text-sm md:text-base text-secondary max-w-3xl mx-auto">
              We design software products that are modern, scalable, and user
              focused, with a strong foundation in performance and reliability.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          // Safely get category and match icon
          const category = typeof project.category === "string" ? project.category.toLowerCase() : "";
          const IconComponent: IconType = iconMap[category] || FaGlobe;

          return (
            <div
              key={project.id}
              className="card group relative overflow-hidden p-6 md:p-7 flex flex-col items-start gap-4"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_55%)] pointer-events-none" />
              <div className="relative flex items-center justify-center w-14 h-14 rounded-md bg-[var(--blue-dim)] border border-[rgba(59,130,246,0.3)]">
                <IconComponent size={26} className="text-[var(--blue-bright)]" />
              </div>
              <h3 className="relative text-xl md:text-2xl font-semibold text-primary">
                {project.title}
              </h3>
              <p className="relative text-secondary text-sm md:text-base leading-relaxed">
                {project.overview}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
