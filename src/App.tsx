import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from './components/ImageCard';
import CategoryTabs from './components/CategoryTabs';
import ImageModal from './components/ImageModal';
import SkeletonCard from './components/SkeletonCard';
import useInfiniteScroll from './hooks/useInfiniteScroll';

// Lolicon API 返回的图片数据结构
interface ILoliconImage {
  pid: number;
  uid: number;
  title: string;
  author: string;
  r18: boolean;
  width: number;
  height: number;
  tags: string[];
  ext: string;
  aiType: number;
  uploadDate: number;
  urls: {
    original: string;
    regular?: string;
    thumb?: string;
  };
}

interface IImage {
  pid: number;
  author: string;
  width: number;
  height: number;
  title: string;
  tags: string[];
  url: string; // 缩略图
  download_url: string; // 原图
}

const CATEGORIES = [
  { id: 'all', name: '全部', tag: '' },
  { id: 'girl', name: '少女', tag: '少女' },
  { id: 'blue-archive', name: '碧蓝档案', tag: 'ブルーアーカイブ' },
  { id: 'genshin', name: '原神', tag: '原神' },
  { id: 'honkai', name: '崩坏', tag: '崩壊' },
  { id: 'fgo', name: 'FGO', tag: 'Fate/GrandOrder' },
];

const LOLICON_API = 'https://api.lolicon.app/setu/v2';

const App: React.FC = () => {
  const [images, setImages] = useState<IImage[]>([]);
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0]);
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const lastDateRef = useRef<number>(0);
  const hasMoreRef = useRef(true);

  const fetchImages = useCallback(async (reset = false) => {
    try {
      const params = new URLSearchParams({
        r18: '0',
        num: '20',
        size: 'regular',
      });
      
      if (currentCategory.tag) {
        params.append('tag', currentCategory.tag);
      }
      
      // 分页：用上一次的最晚上传时间戳
      if (!reset && lastDateRef.current > 0) {
        params.append('dateBefore', String(lastDateRef.current - 1));
      }

      const response = await fetch(`${LOLICON_API}?${params.toString()}`);
      const data = await response.json();
      
      if (data.error) {
        console.error('Lolicon API error:', data.error);
        throw new Error(data.error);
      }

      const rawImages: ILoliconImage[] = data.data || [];
      
      if (rawImages.length === 0) {
        hasMoreRef.current = false;
      }

      // 转换为统一格式
      const converted: IImage[] = rawImages.map(img => ({
        pid: img.pid,
        author: img.author,
        width: img.width,
        height: img.height,
        title: img.title,
        tags: img.tags,
        url: img.urls.regular || img.urls.original,
        download_url: img.urls.original,
      }));

      // 更新分页游标
      if (converted.length > 0) {
        lastDateRef.current = Math.min(...converted.map(i => i.pid));
      }

      if (reset) {
        setImages(converted);
        hasMoreRef.current = true;
      } else {
        setImages(prev => [...prev, ...converted]);
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
    lastDateRef.current = 0;
    hasMoreRef.current = true;
    
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
      <div className="relative columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-x-6">
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
                  key={`${image.pid}-${index}`}
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
