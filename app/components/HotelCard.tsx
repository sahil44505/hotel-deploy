// components/HotelCard.tsx
import React from 'react';

interface HotelCardProps {
  images: string[];
}

const HotelCard: React.FC<HotelCardProps> = ({ images }) => {
  return (
    <div className="card">
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Hotel image ${index + 1}`} />
      ))}
      <style jsx>{`
        .card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default HotelCard;
