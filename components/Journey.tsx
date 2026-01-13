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
      <section className="py-12 sm:py-16 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4 sm:px-6 animate-pulse">
          <div className="text-center mb-12 sm:mb-16">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 mx-auto mb-4 rounded" />
            <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 mx-auto rounded" />
          </div>

          <div className="max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`relative mb-8 md:mb-12 md:flex md:items-center ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 md:w-6 md:h-6 bg-gray-300 dark:bg-gray-600 rounded-full border-2 md:border-4 border-white shadow-lg z-10" />

                {/* Skeleton card */}
                <div
                  className={`ml-12 md:ml-0 md:w-5/12 ${
                    i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                  }`}
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 mb-3 mx-auto md:mx-0 rounded" />
                    <div className="h-3 w-56 bg-gray-300 dark:bg-gray-600 mb-2 mx-auto md:mx-0 rounded" />
                    <div className="h-3 w-44 bg-gray-300 dark:bg-gray-600 mx-auto md:mx-0 rounded" />
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
    <section id="about" className="py-12 sm:py-16 bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-blue dark:text-dark-text mb-4">
            {t('journey.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
            {t('journey.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-accent"></div>

            {milestones.map((milestone, index) => (
              <div
                key={milestone._id || index}
                className={`relative mb-8 md:mb-12 md:flex md:items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 md:w-6 md:h-6 bg-accent rounded-full border-2 md:border-4 border-white shadow-lg z-10"></div>

                <div
                  className={`ml-12 md:ml-0 md:w-5/12 ${
                    index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                  }`}
                >
                  <div
                    className="bg-white dark:bg-dark-surface p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleMilestoneClick(milestone)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleMilestoneClick(milestone);
                    }}
                    aria-label={`Learn more about ${milestone.name}`}
                  >
                    <div className="text-accent font-bold text-base md:text-lg mb-2">
                      {`${milestone.startYear} - ${milestone.endYear}`}, {milestone.name}
                    </div>
                    <p className="text-gray-600 dark:text-dark-text-secondary leading-relaxed text-sm md:text-base">
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
