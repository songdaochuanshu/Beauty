import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from './components/ImageCard';
import CategoryTabs from './components/CategoryTabs';
import ImageModal from './components/ImageModal';
import SkeletonCard from './components/SkeletonCard';
import useInfiniteScroll from './hooks/useInfiniteScroll';

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
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const hasMoreRef = useRef(true);

  const fetchImages = useCallback(async (reset = false) => {
    try {
      const newImages: IImage[] = [];
      for (let i = 0; i < 12; i++) {
        const timestamp = Date.now() + i + Math.random();
        const imageUrl = `https://3650000.xyz/api/?type=302&mode=${currentCategory.mode}&proxy=wp&_t=${timestamp}`;
        newImages.push({
          id: `random-${timestamp}`,
          author: 'Beauty',
          width: 1920,
          height: 1080,
          url: imageUrl,
          download_url: imageUrl
        });
      }
      
      if (reset) {
        setImages(newImages);
        hasMoreRef.current = true;
      } else {
        setImages(prev => [...prev, ...newImages]);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
      throw err;
    }
  }, [currentCategory]);

  const handleCategoryChange = useCallback(async (cat: typeof CATEGORIES[0]) => {
    if (cat.id === currentCategory.id) return;
    
    setIsSwitching(true);
    setCurrentCategory(cat);
    
    // 等待切换动画
    await new Promise(resolve => setTimeout(resolve, 300));
    await fetchImages(true);
    
    setIsSwitching(false);
  }, [currentCategory.id, fetchImages]);

  const { loaderRef, isLoading, error, retry } = useInfiniteScroll({
    onLoadMore: () => fetchImages(false),
    hasMore: hasMoreRef.current,
    threshold: 0.1
  });

  // 初始加载
  useEffect(() => {
    fetchImages(true);
  }, []);

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
        
        <CategoryTabs 
          categories={CATEGORIES}
          currentId={currentCategory.id}
          onChange={handleCategoryChange}
        />
      </header>

      {/* Waterfall Layout */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isSwitching ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4"
            >
              {images.map((image, index) => (
                <ImageCard
                  key={`${image.id}-${index}`}
                  image={image}
                  index={index}
                  onSelect={setSelectedImage}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading/Error Indicator */}
        <div ref={loaderRef} className="py-20 flex flex-col items-center justify-center">
          {error && (
            <div className="mb-4 text-center">
              <p className="text-neutral-500 text-sm mb-2">{error}</p>
              <button
                onClick={retry}
                className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-600 border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
              >
                重试
              </button>
            </div>
          )}
          
          {isLoading && (
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
      </div>

      {/* Image Modal */}
      <ImageModal 
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-neutral-100 py-12 text-center text-neutral-300 text-[10px] tracking-[0.3em] uppercase">
        &copy; {new Date().getFullYear()} Beauty / Crafted for Elegance
      </footer>
    </div>
  );
};

export default App;