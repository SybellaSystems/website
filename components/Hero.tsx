"use client";
import Image from "next/image";
import { useI18n } from "../contexts/I18nContext";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section id="home" className="pt-16 pb-12 bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-dark-blue dark:text-dark-text">
              {t("hero.title")}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 dark:text-dark-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#ecosystem"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-accent text-white font-semibold hover:bg-green-600 transition-colors text-center"
              >
                {t("hero.exploreEcosystem")}
              </a>
              <a
                href="#contact"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-dark-blue text-dark-blue dark:text-dark-text dark:border-dark-text font-semibold hover:bg-dark-blue hover:text-white dark:hover:bg-dark-text dark:hover:text-dark-bg transition-colors text-center"
              >
                {t("hero.startJourney")}
              </a>
            </div>
          </div>

          {/* Image Section with Subtle Glow */}
          <div className="relative order-first lg:order-last">
            <div className="relative p-[3px] rounded-2xl overflow-hidden glow-border">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
                <Image
                  src="/workingman.jpg"
                  alt={t("hero.imageAlt")}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom subtle glow animation */}
      <style jsx>{`
        @keyframes glowPulse {
          0% {
            box-shadow: 0 0 6px #34d399, 0 0 12px #10b981;
          }
          50% {
            box-shadow: 0 0 10px #34d399, 0 0 18px #10b981;
          }
          100% {
            box-shadow: 0 0 6px #34d399, 0 0 12px #10b981;
          }
        }
        .glow-border {
          border-radius: 1rem;
          background: linear-gradient(90deg, #34d399, #10b981);
          animation: glowPulse 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
