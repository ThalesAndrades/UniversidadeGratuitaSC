/**
 * Otimização de imagens para performance
 */

export const compressImage = async (
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1024
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensionar mantendo aspect ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter contexto do canvas'));
          return;
        }
        
        // Desenhar imagem otimizada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Comprimir para JPEG com qualidade ajustada
        let quality = 0.9;
        let result = canvas.toDataURL('image/jpeg', quality);
        
        // Reduzir qualidade até atingir tamanho desejado
        while (result.length > maxSizeMB * 1024 * 1024 && quality > 0.5) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(result);
      };
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
  });
};

// Preload de imagens críticas
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Lazy load com Intersection Observer
export const createLazyImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void
) => {
  if (!('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.01,
    }
  );
};
