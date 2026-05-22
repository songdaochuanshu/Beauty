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
  { id: 'all', name: '全部', seed: 0 },
  { id: 'nature', name: '自然', seed: 10 },
  { id: 'architecture', name: '建筑', seed: 20 },
  { id: 'animals', name: '动物', seed: 30 },
  { id: 'people', name: '人物', seed: 40 },
  { id: 'tech', name: '科技', seed: 50 },
];

const App: React.FC = () => {
  const [images, setImages] = useState<IImage[]>([]);
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const fetchImages = useCallback(async (reset = false) => {
    try {
      const page = reset ? 1 : pageRef.current;
      const limit = 12;
      
      // Since Picsum doesn't support categories, we offset the page by the category's "seed"
      // to simulate different content for different categories.
      const actualPage = page + currentCategory.seed;
      const response = await fetch(`https://picsum.photos/v2/list?page=${actualPage}&limit=${limit}`);
      const data: IImage[] = await response.json();
      
      if (data.length < limit) {
        hasMoreRef.current = false;
      }

      if (reset) {
        setImages(data);
        pageRef.current = 2;
        hasMoreRef.current = true;
      } else {
        setImages(prev => [...prev, ...data]);
        pageRef.current += 1;
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
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300));
    await fetchImages(true);
    
    setIsSwitching(false);
  }, [currentCategory.id, fetchImages]);

  const { loaderRef, isLoading, error, retry } = useInfiniteScroll({
    onLoadMore: async () => {
      setIsLoadingMore(true);
      try {
        await fetchImages(false);
      } finally {
        setIsLoadingMore(false);
      }
    },
    hasMore: hasMoreRef.current,
    threshold: 0.1
  });

  // Initial load
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

      {/* Waterfall Layout - 使用 columns 布局 */}
      <div className="relative columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
        <AnimatePresence mode="wait">
          {isSwitching ? (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </>
          ) : (
            <>
              {images.map((image, index) => (
                <ImageCard
                  key={`${image.id}-${index}`}
                  image={image}
                  index={index}
                  onSelect={setSelectedImage}
                />
              ))}
              {/* 加载更多时显示占位图 */}
              {isLoadingMore &&
                Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={`loading-${i}`} index={i} width={600} height={400} />
                ))}
            </>
          )}
        </AnimatePresence>
      </div>

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
        
        {isLoading && !isLoadingMore && (
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
