/**
 * Otimização de imagens para performance
 */

export const compressImage = async (
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1024
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Verificação Estrita de Tipo MIME (Bloqueia arquivos mascarados como imagem)
    if (!file.type.startsWith('image/')) {
      reject(new Error('Tipo de arquivo não permitido. Apenas imagens.'));
      return;
    }

    // 2. Bloquear SVGs (Potencial vetor de ataque XSS em uploads)
    if (file.type === 'image/svg+xml') {
      reject(new Error('Formato SVG não permitido por motivos de segurança.'));
      return;
    }

    // 3. Validar extensão do arquivo como camada extra
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'];
    if (file.name.includes('.') && !allowedExt.includes(ext)) {
      reject(new Error('Extensão de arquivo não permitida.'));
      return;
    }

    // 4. Limite de tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('Arquivo muito grande. Máximo 10MB.'));
      return;
    }

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
        
        // Forçar saída como JPEG/WebP para purificar qualquer dado embutido no arquivo original (Limpeza Exif/Metadados/Malware Oculto)
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
        reject(new Error('O arquivo enviado não é uma imagem válida.'));
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
