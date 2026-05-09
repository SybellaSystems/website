"use client";
import { FaCloud, FaChartLine, FaUsers, FaLock } from "react-icons/fa";
import { useI18n } from "../contexts/I18nContext";

export default function EcosystemSolutions() {
  const { t } = useI18n();
  
  const solutions = [
    {
      title: t("ecosystem.cloud.title"),
      description: t("ecosystem.cloud.desc"),
      icon: <FaCloud size={30} />,
    },
    {
      title: t("ecosystem.analytics.title"),
      description: t("ecosystem.analytics.desc"),
      icon: <FaChartLine size={30} />,
    },
    {
      title: t("ecosystem.collaboration.title"),
      description: t("ecosystem.collaboration.desc"),
      icon: <FaUsers size={30} />,
    },
    {
      title: t("ecosystem.security.title"),
      description: t("ecosystem.security.desc"),
      icon: <FaLock size={30} />,
    },
  ];
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-dark-surface dark:via-dark-card dark:to-dark-surface">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          {t("ecosystem.title")}
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, i) => (
            <div
              key={i}
              className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-8 text-center hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-blue-600 bg-blue-100 rounded-full">
                {solution.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                {solution.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
