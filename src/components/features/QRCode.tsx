import { useEffect, useRef, memo } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

function QRCode({ value, size = 128, bgColor = '#ffffff', fgColor = '#000000', className = '' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code generation using a data matrix approach
    // For production, this would use a proper QR code library
    // For now, we'll create a simple placeholder pattern that looks like a QR code
    
    const moduleCount = 25; // Standard QR code module count for small data
    const moduleSize = size / moduleCount;
    
    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    
    // Create a deterministic pattern based on the value
    ctx.fillStyle = fgColor;
    
    // Draw position markers (corners)
    const drawPositionMarker = (x: number, y: number) => {
      // Outer square
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
      ctx.fillStyle = bgColor;
      ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.fillStyle = fgColor;
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };
    
    // Top-left
    drawPositionMarker(0, 0);
    // Top-right
    drawPositionMarker(moduleCount - 7, 0);
    // Bottom-left
    drawPositionMarker(0, moduleCount - 7);
    
    // Generate pseudo-random pattern based on value
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash = hash & hash;
    }
    
    // Fill data area with pattern
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        // Skip position markers
        if ((row < 8 && col < 8) || 
            (row < 8 && col >= moduleCount - 8) || 
            (row >= moduleCount - 8 && col < 8)) {
          continue;
        }
        
        // Create deterministic pattern
        const seed = (hash + row * moduleCount + col) % 3;
        if (seed === 0) {
          ctx.fillStyle = fgColor;
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Draw timing patterns
    ctx.fillStyle = fgColor;
    for (let i = 8; i < moduleCount - 8; i += 2) {
      ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
      ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
    }
    
  }, [value, size, bgColor, fgColor]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export default memo(QRCode);
