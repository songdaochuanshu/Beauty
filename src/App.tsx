import React, { useState, useEffect } from 'react';
import './App.scss';

interface IImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export default function App() {
  const [imagesList, setImagesList] = useState<IImage[]>([]);
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchInitialImages() {
      await getImages(16, 1);
    }
    fetchInitialImages();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key === 'Escape') {
        closeEnlarge();
      }
    };
    return () => {
      document.onkeydown = null;
    };
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 500 &&
      !loading
    ) {
      const page = Math.floor(imagesList.length / 16) + 1;
      getImages(16, page);
    }
  };

  const getImages = async (size = 16, page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${size}`);
      const data = await response.json();
      setImagesList((prevImages) => [
        ...prevImages,
        ...data.filter((image: IImage) => !loadedIds.has(image.id)),
      ]);
      setLoadedIds((prevIds) => new Set([...prevIds, ...data.map((image: IImage) => image.id)]));
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const [enlargedImageSrc, setEnlargedImageSrc] = useState<string | null>(null);

  const clickEnlarge = (src: string) => {
    setEnlargedImageSrc(src);
  };

  const closeEnlarge = () => {
    setEnlargedImageSrc(null);
  };

  return (
    <div>
      <div className="waterfall">
        {imagesList.map((image) => (
          <div className="image-box" key={image.id}>
            <img
              onClick={() => clickEnlarge(image.download_url)}
              src={image.download_url}
              width={image.width / 10}
              height={image.height / 10}
              alt=""
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {enlargedImageSrc && (
        <div className="enlarge-overlay" onClick={closeEnlarge}>
          <img
            src={enlargedImageSrc}
            alt=""
            style={{ maxWidth: '100%', maxHeight: '95%' }}
          />
        </div>
      )}
      {loading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
}