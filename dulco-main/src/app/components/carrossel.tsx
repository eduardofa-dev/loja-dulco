'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Carrossel() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] relative overflow-hidden mt-4">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        loop={true}
        centeredSlides={true}
        onBeforeInit={(swiper) => {
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation === 'object'
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="h-full"
      >
        {['slide1.jpg', 'slide2.jpg', 'slide3.jpg', 'slide4.jpg', 'slide5.jpg'].map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
              <Image
                className="object-cover"
                src={`/imagens/${img}`}
                alt={`Slide ${index + 1}`}
                fill
              />
            </div>
          </SwiperSlide>
        ))}

        {/* Botão anterior */}
        <button
          ref={prevRef}
          className="hidden sm:flex absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 focus:outline-none"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Botão próximo */}
        <button
          ref={nextRef}
          className="hidden sm:flex absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 focus:outline-none"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </Swiper>

      <style jsx global>{`
        .swiper-slide {
          filter: blur(4px);
          opacity: 0.5;
          transform: scale(0.8);
          transition: all 0.3s ease;
          z-index: 0;
        }

        .swiper-slide-prev,
        .swiper-slide-next {
          filter: blur(2px);
          opacity: 0.75;
          transform: scale(0.9);
          z-index: 5;
        }

        .swiper-slide-active {
          filter: blur(0);
          opacity: 1;
          transform: scale(1.05);
          z-index: 10;
        }

        .swiper-pagination-bullets {
          bottom: 10px !important;
        }

        .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.6;
          transition: all 0.3s;
        }

        .swiper-pagination-bullet-active {
          background: #000;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
