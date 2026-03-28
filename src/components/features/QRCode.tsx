import { memo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  className?: string;
}

function QRCode({ value, size = 128, bgColor = '#ffffff', fgColor = '#000000', level = 'M', className = '' }: QRCodeProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      level={level}
      className={className}
    />
  );
}

export default memo(QRCode);
