"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MilestonesSection from "./MilestonesSection";
import TeamMembersSection from "./TeamMembersSection";
import ProjectsSection from "./ProjectsSection";
import UpdatesSection from "./UpdatesSections";
// import BlogSection from "./BlogSection";

type SectionType = "milestones" | "projects" | "blogs" | "team_members" | "updates"

// Inner component that safely uses useSearchParams inside Suspense
function SectionsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as SectionType | null;

  const [activeSection, setActiveSection] = useState<SectionType>("milestones");

  useEffect(() => {
    if (tab) setActiveSection(tab);
  }, [tab]);

  return (
    <main className="flex-1 p-6">
      {activeSection === "milestones" && <MilestonesSection />}
      {activeSection === "team_members" && <TeamMembersSection />}
      {activeSection === "projects" && <ProjectsSection />}
      {activeSection === "updates" && <UpdatesSection />}
      {/* {activeSection === "blogs" && <BlogSection />} */}
    </main>
  );
}

export default function AdminSectionsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Wrap the searchParams consumer in Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <SectionsContent />
      </Suspense>
    </div>
  );
}