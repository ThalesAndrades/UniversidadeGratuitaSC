import { useEffect, useState } from 'react';

/**
 * Hook para preload de imagens críticas
 */
export function useImagePreload(images: string[]) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      setLoaded(true);
      return;
    }

    let mounted = true;
    let loadedCount = 0;

    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all(images.map(preloadImage))
      .then(() => {
        if (mounted) {
          setLoaded(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setError(true);
          setLoaded(true); // Continue mesmo com erro
        }
      });

    return () => {
      mounted = false;
    };
  }, [images]);

  return { loaded, error };
}
