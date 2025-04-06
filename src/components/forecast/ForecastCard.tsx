import Image from "next/image";
import React from "react";

interface ForecastCardProps {
  date: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  description: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  date,
  icon,
  tempMin,
  tempMax,
  description,
}) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <p className="text-xl font-bold">{date}</p>
      <Image
        width={100}
        height={100}
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        className="mx-auto my-2"
        priority={true}
      />
      <p className="text-lg">
        {tempMax}° / {tempMin}°
      </p>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};

export default ForecastCard;
