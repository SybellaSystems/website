'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { useI18n } from '../contexts/I18nContext';
import axios from 'axios';
import Loader from './Loader';
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
      <section className="relative py-16 sm:py-20 bg-[#07090d] overflow-hidden border-t border-dim">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/team-slider-bg2.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '120px 120px',
            opacity: 0.08,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_60%),radial-gradient(circle_at_80%_30%,rgba(45,186,133,0.12),transparent_55%)]"
        />

        <div className="container mx-auto px-6 relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-white mb-12">
            {t('team.title')}
          </h2>
          <Loader size="lg" text="Loading team members..." />
        </div>
      </section>
    );
  }


  return (
    <section className="relative py-16 sm:py-20 bg-[#07090d] overflow-hidden border-t border-dim">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/team-slider-bg2.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
          opacity: 0.08,
        }}
      />
      <div aria-hidden className="absolute inset-0 pointer-events-none bg-black/55" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_62%),radial-gradient(circle_at_78%_30%,rgba(45,186,133,0.12),transparent_58%)]"
      />

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-white mb-12">
          {t('team.title')}
        </h2>

        <Swiper
          className="team-swiper"
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
          {members.map((member, index) => {
            const imageUrl = member.image || '/profile.webp';
            const isExternalUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
            
            return (
              <SwiperSlide key={index} className="flex justify-center">
                <div className="team-card card relative w-full max-w-[320px] min-h-[340px] rounded-2xl border border-white/10 bg-white/5 p-7 text-center flex flex-col transition-[border-color,box-shadow] duration-300 hover:border-[rgba(96,165,250,0.35)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
                  <div className="relative w-36 h-36 mx-auto mb-4 overflow-hidden rounded-full border-4 border-white/15 bg-white/5">
                    {isExternalUrl ? (
                      <img
                        src={imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/profile.webp';
                        }}
                      />
                    ) : (
                      <Image
                        src={imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <h3 className="mt-1 text-xl font-semibold text-white">{member.name}</h3>
                  <p className="text-emerald font-medium mt-2">{member.role}</p>

                  {/* Social Links */}
                  <div className="mt-auto flex justify-center gap-4 pt-6 text-[var(--text-secondary)]">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald transition-colors"
                      >
                        <FaLinkedin size={20} />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald transition-colors"
                      >
                        <FaTwitter size={20} />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald transition-colors"
                      >
                        <FaGithub size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <style>{`
          .team-swiper .swiper-button-next,
          .team-swiper .swiper-button-prev {
            color: rgba(96,165,250,1);
          }
          .team-swiper .swiper-button-next::after,
          .team-swiper .swiper-button-prev::after {
            font-size: 18px;
          }
          .team-swiper .swiper-pagination-bullet {
            background: rgba(242,240,234,0.35);
            opacity: 1;
          }
          .team-swiper .swiper-pagination-bullet-active {
            background: rgb(96,165,250);
          }
        `}</style>
      </div>
    </section>
  );
}
