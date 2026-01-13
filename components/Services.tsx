'use client'
import { ServiceItem } from '../types';
import { logger } from '../lib/logger';
import { useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';

const Services = () => {
    const { t } = useI18n()

    const ecosystemItems: ServiceItem[] = [
        {
            icon: '🎓',
            title: t('services.education.title'),
            description: t('services.education.desc')
        },
        {
            icon: '🏥',
            title: t('services.healthcare.title'),
            description: t('services.healthcare.desc')
        },
        {
            icon: '🛒',
            title: t('services.retail.title'),
            description: t('services.retail.desc')
        },
        {
            icon: '🏨',
            title: t('services.hospitality.title'),
            description: t('services.hospitality.desc')
        },
        {
            icon: '🏢',
            title: t('services.realestate.title'),
            description: t('services.realestate.desc')
        },
        {
            icon: '🚗',
            title: t('services.transport.title'),
            description: t('services.transport.desc')
        }
    ];

    const additionalServices: ServiceItem[] = [
        {
            icon: '👥',
            title: t('services.hr.title'),
            description: t('services.hr.desc')
        },
        {
            icon: '📊',
            title: t('services.inventory.title'),
            description: t('services.inventory.desc')
        },
        {
            icon: '🏛️',
            title: t('services.government.title'),
            description: t('services.government.desc')
        }
    ];

    useEffect(() => {
        logger.info('Services component loaded', {
            component: 'Services',
            ecosystemItemsCount: ecosystemItems.length,
            additionalServicesCount: additionalServices.length
        });
    }, []);

    const handleServiceClick = (serviceTitle: string): void => {
        logger.userInteraction('Service card clicked', {
            service: serviceTitle,
            section: 'ecosystem'
        });
    };

    return (
        <div>
            <section id="ecosystem" className="py-12 sm:py-16 bg-white dark:bg-dark-bg">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-blue dark:text-dark-text mb-4">
                            {t('services.title')}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
                            {t('services.subtitle')}
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {ecosystemItems.map((item, index) => (
                            <div
                                key={`ecosystem-${index}`}
                                className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                onClick={() => handleServiceClick(item.title)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleServiceClick(item.title);
                                    }
                                }}
                                aria-label={`Learn more about ${item.title}`}
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow rounded-full flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-dark-blue dark:text-dark-text mb-3 sm:mb-4">{item.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 sm:py-16 bg-gray-50 dark:bg-dark-surface">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {additionalServices.map((item, index) => (
                            <div
                                key={`additional-${index}`}
                                className="bg-white dark:bg-dark-bg p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                onClick={() => handleServiceClick(item.title)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleServiceClick(item.title);
                                    }
                                }}
                                aria-label={`Learn more about ${item.title}`}
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow rounded-full flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-dark-blue dark:text-dark-text mb-3 sm:mb-4">{item.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
