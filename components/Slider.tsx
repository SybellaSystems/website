'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { useI18n } from '../contexts/I18nContext';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Member {
  name: string;
  role: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export default function TeamSlider() {
  const { t } = useI18n();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team');
      if (res.data.success) setMembers(res.data.members);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

 
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-dark-surface dark:via-dark-bg dark:to-dark-surface">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            {t('team.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-6 text-center animate-pulse"
              >
                <div className="relative w-36 h-36 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-32 mx-auto bg-gray-200 dark:bg-gray-700 mb-2 rounded" />
                <div className="h-4 w-20 mx-auto bg-gray-200 dark:bg-gray-700 mb-3 rounded" />
                <div className="flex justify-center gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }


  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-dark-surface dark:via-dark-bg dark:to-dark-surface">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          {t('team.title')}
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={800}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {members.map((member, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-6 text-center transition transform hover:scale-105 hover:shadow-2xl duration-300">
                <div className="relative w-36 h-36 mx-auto mb-4 overflow-hidden rounded-full border-4 border-blue-100 shadow-md">
                  <Image
                    src={member.image || '/fallback-profile.png'}
                    alt={member.name}
                    fill
                    className="object-cover transition-opacity duration-500 opacity-0"
                    onLoadingComplete={(img) => img.classList.remove('opacity-0')}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>

                {/* Social Links */}
                <div className="flex justify-center gap-4 text-gray-500">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors"
                    >
                      <FaTwitter size={20} />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-900 transition-colors"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
