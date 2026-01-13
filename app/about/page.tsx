"use client";
import { useI18n } from '../../contexts/I18nContext';
import Image from "next/image";

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
      {/* Page Heading */}
      <div className="max-w-4xl mx-auto text-center mb-16 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-indigo-700 dark:text-yellow-400 leading-tight">
          {t('about.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      {/* Who We Are - Hero Style */}
      <div className="relative max-w-7xl mx-auto mb-20">
        {/* Background Image */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          <Image
            src="/people.jpg"
            alt="Who we are"
            fill
            priority
            className="object-cover rounded-3xl shadow-xl"
          />
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
        </div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              {t('about.whoWeAre.title')}
            </h2>
            <p className="mb-4 text-lg md:text-xl leading-relaxed text-gray-100 drop-shadow">
              {t('about.whoWeAre.desc1')}
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-gray-100 drop-shadow">
              {t('about.whoWeAre.desc2')}
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto px-6 mb-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h3 className="text-3xl font-semibold text-indigo-700 dark:text-yellow-400">
            {t('about.mission.title')}
          </h3>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {t('about.mission.desc')}
          </p>
        </div>
        <div className="relative w-full h-72">
          <Image
            src="/children.jpg"
            alt="Mission illustration"
            fill
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mb-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-72 order-2 md:order-1">
          <Image
            src="/vision.jpg"
            alt="Vision illustration"
            fill
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>
        <div className="order-1 md:order-2 space-y-6">
          <h3 className="text-3xl font-semibold text-indigo-700 dark:text-yellow-400">
            {t('about.vision.title')}
          </h3>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {t('about.vision.desc')}
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-700 dark:text-yellow-400">
          {t('about.values.title')}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: t("about.values.innovation.title"),
              desc: t("about.values.innovation.desc"),
              color: "from-indigo-50 to-blue-50",
              img: "/innovation.jpg",
            },
            {
              title: t("about.values.empowerment.title"),
              desc: t("about.values.empowerment.desc"),
              color: "from-purple-50 to-pink-50",
              img: "/empowerment.jpg",
            },
            {
              title: t("about.values.sustainability.title"),
              desc: t("about.values.sustainability.desc"),
              color: "from-green-50 to-teal-50",
              img: "/sustain.jpg",
            },
            {
              title: t("about.values.community.title"),
              desc: t("about.values.community.desc"),
              color: "from-yellow-50 to-orange-50",
              img: "/community.jpg",
            },
            {
              title: t("about.values.integrity.title"),
              desc: t("about.values.integrity.desc"),
              color: "from-red-50 to-pink-100",
              img: "/integrity.jpg",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-r ${item.color} dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
            >
              <div className="relative w-full h-40 mb-4">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="rounded-2xl object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-indigo-700 dark:text-yellow-400 group-hover:underline decoration-2 decoration-indigo-500 dark:decoration-yellow-400">
                {item.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {item.desc}
              </p>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-200 dark:bg-yellow-500 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
