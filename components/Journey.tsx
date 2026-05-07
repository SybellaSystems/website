'use client';
import { useState, useEffect } from 'react';
import { Milestone } from '../types';
import { logger } from '../lib/logger';
import { useI18n } from '../contexts/I18nContext';

const Journey = () => {
  const { t } = useI18n();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const res = await fetch('/api/milestones', { method: 'GET' });
        if (!res.ok) throw new Error(`Failed to fetch milestones (${res.status})`);

        const data = await res.json();
        if (data?.milestones) {
          setMilestones(data.milestones);
        } else {
          setError('No milestones found');
        }
      } catch (err: any) {
        logger.error('Error fetching milestones', err);
        setError(err.message || 'Failed to load milestones');
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  useEffect(() => {
    logger.info('Journey component loaded', {
      component: 'Journey',
    });
  }, []);

  const handleMilestoneClick = (milestone: Milestone): void => {
    logger.userInteraction('Milestone clicked', {
      milestone: milestone.name,
      year: `${milestone.startYear} - ${milestone.endYear}`,
      section: 'journey',
    });
  };


  if (loading) {
    return (
      <section className="relative py-14 sm:py-20 bg-[#07090d] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: "url('/globe.svg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '120px 120px',
          }}
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_25%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_78%_70%,rgba(45,186,133,0.14),transparent_45%)]" />

        <div className="relative container mx-auto px-4 sm:px-6 animate-pulse">
          <div className="text-center mb-12 sm:mb-16">
            <div className="h-8 w-56 bg-gray-700/70 mx-auto mb-4 rounded" />
            <div className="h-4 w-80 bg-gray-700/60 mx-auto rounded" />
          </div>

          <div className="max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`relative mb-8 md:mb-12 md:flex md:items-center ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 md:w-6 md:h-6 bg-blue-400/70 rounded-full border-2 md:border-4 border-[#07090d] shadow-lg z-10" />

                {/* Skeleton card */}
                <div
                  className={`ml-12 md:ml-0 md:w-5/12 ${
                    i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                  }`}
                >
                  <div className="bg-[#0b0f18]/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-white/10">
                    <div className="h-5 w-40 bg-gray-600/70 mb-3 mx-auto md:mx-0 rounded" />
                    <div className="h-3 w-56 bg-gray-700/70 mb-2 mx-auto md:mx-0 rounded" />
                    <div className="h-3 w-44 bg-gray-700/60 mx-auto md:mx-0 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 text-center">
        <p className="text-red-500">Error: {error}</p>
      </section>
    );
  }


  return (
    <section id="about" className="relative py-14 sm:py-20 bg-[#07090d] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "url('/globe.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_78%_70%,rgba(201,168,76,0.18),transparent_48%)]" />

      <div className="relative container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {t('journey.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            {t('journey.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-blue-400/35 via-blue-400/90 to-transparent" />

            {milestones.map((milestone, index) => (
              <div
                key={milestone._id || index}
                className={`relative mb-8 md:mb-12 md:flex md:items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 md:w-6 md:h-6 bg-blue-400 rounded-full border-2 md:border-4 border-[#07090d] shadow-lg shadow-blue-400/40 z-10" />

                <div
                  className={`ml-12 md:ml-0 md:w-5/12 ${
                    index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                  }`}
                >
                  <div
                    className="bg-[#0b0f18]/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-white/10 hover:border-blue-300/30 hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    onClick={() => handleMilestoneClick(milestone)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleMilestoneClick(milestone);
                    }}
                    aria-label={`Learn more about ${milestone.name}`}
                  >
                    <div className="text-blue-400 font-bold text-base md:text-lg mb-2">
                      {`${milestone.startYear} - ${milestone.endYear}`}, {milestone.name}
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
