// src/components/ForecastSlider.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ForecastCard from "./ForecastCard"; // Importamos el componente ForecastCard

interface ForecastSliderProps {
  forecast: Array<{
    date: string;
    icon: string;
    tempMin: number;
    tempMax: number;
    description: string;
  }>;
}

const ForecastSlider: React.FC<ForecastSliderProps> = ({ forecast }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-3">
      <Swiper
        spaceBetween={15}
        slidesPerView={3}
        loop={true}
        centeredSlides={true}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
      >
        {forecast.map((day, index) => (
          <SwiperSlide key={index}>
            <ForecastCard
              date={day.date}
              icon={day.icon}
              tempMin={day.tempMin}
              tempMax={day.tempMax}
              description={""}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ForecastSlider;
