import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

const generateQR = async () => {
  try {
    const url = 'https://teste.sbs';
    const outputPath = path.join(__dirname, 'qrcode_passaporte_oficial.png');
    const logoPath = path.join(__dirname, 'src', 'assets', 'logo-programa.png');

    // 1. Gera o QR Code base na memória
    const qrBuffer = await QRCode.toBuffer(url, {
      color: {
        dark: '#002855', // Azul profundo elegante
        light: '#FFFFFF'
      },
      width: 2000,
      margin: 2,
      errorCorrectionLevel: 'H' // Tolerância máxima (30%) - essencial para embutir algo grande no meio
    });

    // 2. Carrega as imagens
    const qrImage = await loadImage(qrBuffer);
    const logoImage = await loadImage(logoPath);

    // 3. Configura o Canvas principal estilo "Poster"
    const canvasWidth = 2200;
    const canvasHeight = 2200; // Alterado para ser quadrado (removendo a parte inferior do texto)
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // 4. Preenche o fundo com um gradiente super leve e sofisticado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f1f5f9'); // Slate-50
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 5. Desenha o container do QR Code (Efeito Glass/Card elevado)
    const cardMargin = 150;
    const cardWidth = canvasWidth - (cardMargin * 2);
    const cardHeight = cardWidth; 
    const cardX = cardMargin;
    const cardY = cardMargin + 50;

    // Sombra do card principal
    ctx.shadowColor = 'rgba(0, 40, 85, 0.15)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 25;
    
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, 60);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // 6. Desenha o QR Code
    const qrMargin = 60;
    const qrDrawSize = cardWidth - (qrMargin * 2);
    ctx.drawImage(qrImage, cardX + qrMargin, cardY + qrMargin, qrDrawSize, qrDrawSize);

    // 7. Marca D'água Central Inteligente (Logo Original SEM sobreposições)
    const centerBoxSize = qrDrawSize * 0.28; // 28% do tamanho do QR
    const centerBoxX = cardX + qrMargin + (qrDrawSize - centerBoxSize) / 2;
    const centerBoxY = cardY + qrMargin + (qrDrawSize - centerBoxSize) / 2;

    // Desenha a Logo do Programa original diretamente sobre o QR Code
    // SEM retângulo branco, SEM borda, apenas a logo pura
    const logoRatio = logoImage.height / logoImage.width;
    const logoDrawWidth = centerBoxSize * 0.90; // Ligeiramente maior para melhor visibilidade
    const logoDrawHeight = logoDrawWidth * logoRatio;
    const logoX = centerBoxX + (centerBoxSize - logoDrawWidth) / 2;
    const logoY = centerBoxY + (centerBoxSize - logoDrawHeight) / 2;

    ctx.globalAlpha = 0.98; // Quase opaco para máxima visibilidade
    ctx.drawImage(logoImage, logoX, logoY, logoDrawWidth, logoDrawHeight);
    ctx.globalAlpha = 1.0;

    // 8. Salva o arquivo final
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream({
      compressionLevel: 9,
      filters: canvas.PNG_FILTER_NONE
    });
    
    stream.pipe(out);
    
    out.on('finish', () => {
      console.log('✨ QR Code Premium com CTA gerado com sucesso em:');
      console.log(outputPath);
      console.log('🖼️  Verifique o arquivo qrcode_passaporte_oficial.png');
    });

  } catch (err) {
    console.error('❌ Erro ao gerar QR Code:', err);
  }
};

generateQR();