import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

const App: React.FC = () => {
  const [images, setImages] = useState<IImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchImages = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      // 3650000.xyz API doesn't support pagination in the same way as picsum
      // We'll fetch multiple images by calling the API multiple times or just one by one
      // Since it's a random API, we'll fetch a batch of 10 random images
      const newImages: IImage[] = [];
      for (let i = 0; i < 10; i++) {
        const timestamp = Date.now() + i;
        const imageUrl = `https://3650000.xyz/api/?type=302&_t=${timestamp}`;
        newImages.push({
          id: `random-${timestamp}`,
          author: '3650000.xyz',
          width: 1920,
          height: 1080,
          url: imageUrl,
          download_url: imageUrl
        });
      }
      setImages((prev) => [...prev, ...newImages]);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchImages();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchImages, loading]);

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-12 md:px-8 lg:px-16">
      {/* Header */}
      <header className="mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extralight tracking-widest text-neutral-800 uppercase"
        >
          Beauty
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-neutral-400 font-light italic"
        >
          A curated collection of visual aesthetics powered by 3650000.xyz
        </motion.p>
      </header>

      {/* Waterfall Layout */}
      <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {images.map((image, index) => (
          <motion.div
            key={`${image.id}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
            className="break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 cursor-zoom-in group relative shadow-sm hover:shadow-xl transition-shadow duration-500"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.download_url}
              alt={image.author}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white text-sm font-light tracking-wider uppercase opacity-80">
                {image.author}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading Indicator */}
      <div ref={loaderRef} className="py-20 flex justify-center">
        {loading && (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-2 h-2 bg-neutral-400 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full overflow-hidden rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.download_url}
                alt={selectedImage.author}
                className="max-w-full max-h-[85vh] object-contain"
              />
              <div className="bg-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-neutral-800 font-medium tracking-wide uppercase">
                    {selectedImage.author}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-1">
                    Random Image from 3650000.xyz
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="text-neutral-400 hover:text-neutral-800 transition-colors uppercase text-xs tracking-widest"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 border-t border-neutral-100 pt-12 text-center text-neutral-300 text-xs tracking-[0.2em] uppercase">
        &copy; {new Date().getFullYear()} Beauty / Crafted for Elegance
      </footer>
    </div>
  );
};

export default App;
