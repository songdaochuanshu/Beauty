import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface ImageModalProps {
  image: IImage | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md p-4 md:p-12"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-w-full max-h-full overflow-hidden rounded-sm shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image.download_url}
            alt="Beauty"
            className="max-w-full max-h-[90vh] object-contain"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-800 transition-colors uppercase text-[10px] tracking-[0.3em]"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;