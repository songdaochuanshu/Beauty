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

const CATEGORIES = [
  { id: 'all', name: '全部', mode: '1,2,3,5,7,8,9' },
  { id: 'weibo', name: '微博美女', mode: '1' },
  { id: 'ins', name: 'Instagram', mode: '2' },
  { id: 'cos', name: 'Cosplay', mode: '3' },
  { id: 'mtcos', name: 'Mtcos', mode: '5' },
  { id: 'legs', name: '美腿', mode: '7' },
  { id: 'coser', name: 'Coser分类', mode: '8' },
  { id: 'tuwan', name: '兔玩映画', mode: '9' },
];

const App: React.FC = () => {
  const [images, setImages] = useState<IImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchImages = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const newImages: IImage[] = [];
      for (let i = 0; i < 12; i++) {
        const timestamp = Date.now() + i + Math.random();
        // 尝试直接使用 API 提供的展示链接，或者使用 type=img 模式
        // 很多时候 302 重定向在某些前端环境下会被拦截，直接使用 type=img 模式由服务端返回内容
        const imageUrl = `https://3650000.xyz/api/?type=img&mode=${currentCategory.mode}&_t=${timestamp}`;
        newImages.push({
          id: `random-${timestamp}`,
          author: 'Beauty',
          width: 1920,
          height: 1080,
          url: imageUrl,
          download_url: imageUrl
        });
      }
      setImages((prev) => reset ? newImages : [...prev, ...newImages]);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, currentCategory]);

  useEffect(() => {
    fetchImages(true);
  }, [currentCategory]);

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
      <header className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extralight tracking-widest text-neutral-800 uppercase"
        >
          Beauty
        </motion.h1>
        
        {/* Category Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 md:gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 ${
                currentCategory.id === cat.id
                  ? 'bg-neutral-800 text-white shadow-md'
                  : 'bg-white text-neutral-400 hover:text-neutral-600 border border-neutral-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Waterfall Layout */}
      <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {images.map((image, index) => (
          <motion.div
            key={`${image.id}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
            className="break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 cursor-zoom-in group relative shadow-sm hover:shadow-xl transition-shadow duration-500"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.download_url}
              alt="Beauty Image"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <div className="w-8 h-[1px] bg-white/50 mb-2"></div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-full max-h-full overflow-hidden rounded-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.download_url}
                alt="Beauty"
                className="max-w-full max-h-[90vh] object-contain"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-800 transition-colors uppercase text-[10px] tracking-[0.3em]"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 border-t border-neutral-100 py-12 text-center text-neutral-300 text-[10px] tracking-[0.3em] uppercase">
        &copy; {new Date().getFullYear()} Beauty / Crafted for Elegance
      </footer>
    </div>
  );
};

export default App;
