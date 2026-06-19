import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface IImage {
  pid: number;
  author: string;
  width: number;
  height: number;
  title: string;
  tags: string[];
  url: string;
  download_url: string;
}

interface ImageCardProps {
  image: IImage;
  index: number;
  onSelect: (image: IImage) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, index, onSelect }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 计算纵横比百分比 (padding-bottom 技巧)
  const aspectRatio = (image.height / image.width) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="break-inside-avoid mb-6 overflow-hidden rounded-xl bg-neutral-100 cursor-zoom-in group relative shadow-sm hover:shadow-xl transition-shadow duration-500"
      onClick={() => onSelect(image)}
    >
      {/* 保持纵横比的容器 */}
      <div 
        style={{ paddingBottom: `${aspectRatio}%` }} 
        className="relative w-full bg-neutral-200 overflow-hidden"
      >
        <img
          src={image.download_url}
          alt="Beauty Image"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        
        {/* 图片加载前的内部占位动画 */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-200" />
        )}
      </div>

      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none">
        <div className="w-8 h-[1px] bg-white/50 mb-2"></div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
