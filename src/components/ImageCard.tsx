import React from 'react';
import { motion } from 'framer-motion';

interface IImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface ImageCardProps {
  image: IImage;
  index: number;
  onSelect: (image: IImage) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, index, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 cursor-zoom-in group relative shadow-sm hover:shadow-xl transition-shadow duration-500"
      onClick={() => onSelect(image)}
    >
      <img
        src={image.download_url}
        alt="Beauty Image"
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <div className="w-8 h-[1px] bg-white/50 mb-2"></div>
      </div>
    </motion.div>
  );
};

export default ImageCard;