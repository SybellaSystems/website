"use client";
import { Lightbulb, Target, Users, TrendingUp } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function USPSection() {
  const { t } = useI18n();
  
  const usps = [
    {
      icon: <Lightbulb className="w-10 h-10 text-yellow-500" />,
      title: t("usp.smartTech.title"),
      desc: t("usp.smartTech.desc"),
    },
    {
      icon: <Target className="w-10 h-10 text-blue-500" />,
      title: t("usp.strategy.title"),
      desc: t("usp.strategy.desc"),
    },
    {
      icon: <Users className="w-10 h-10 text-green-500" />,
      title: t("usp.design.title"),
      desc: t("usp.design.desc"),
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-purple-500" />,
      title: t("usp.results.title"),
      desc: t("usp.results.desc"),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-dark-surface dark:to-dark-bg">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {t("usp.title")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
          {t("usp.subtitle")}
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((usp, index) => (
            <div
              key={index}
              className="bg-white dark:bg-dark-surface shadow-md hover:shadow-xl transition rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4">{usp.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{usp.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
