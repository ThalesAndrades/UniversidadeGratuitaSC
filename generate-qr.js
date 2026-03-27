import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateQR = async () => {
  try {
    const url = 'https://teste.sbs';
    const outputPath = path.join(__dirname, 'qrcode_vans_oficial.png');
    const logoPath = path.join(__dirname, 'src', 'assets', 'logo-programa.png');

    // 1. Gera o QR Code base na memória (sem salvar no disco)
    const qrBuffer = await QRCode.toBuffer(url, {
      color: {
        dark: '#003366', // Azul Escuro Governo SC
        light: '#FFFFFF' // Fundo branco
      },
      width: 1200, // Tamanho gigante para não perder qualidade na impressão
      margin: 2,
      errorCorrectionLevel: 'H' // Tolerância máxima a danos (30%) para podermos cobrir o centro
    });

    // 2. Carrega as imagens no Canvas
    const qrImage = await loadImage(qrBuffer);
    const logoImage = await loadImage(logoPath);

    // 3. Configura o Canvas principal
    const canvas = createCanvas(qrImage.width, qrImage.height);
    const ctx = canvas.getContext('2d');

    // 4. Desenha o QR Code
    ctx.drawImage(qrImage, 0, 0, qrImage.width, qrImage.height);

    // 5. Calcula o tamanho e posição do logo no centro
    // Como usamos correção 'H', podemos cobrir até 30% do QR code. Usaremos cerca de 20%.
    const logoSize = qrImage.width * 0.22; 
    const logoX = (qrImage.width - logoSize) / 2;
    const logoY = (qrImage.height - logoSize) / 2;

    // 6. Desenha um fundo branco (moldura circular) por trás do logo para destacar
    ctx.beginPath();
    ctx.arc(
      logoX + logoSize / 2, 
      logoY + logoSize / 2, 
      (logoSize / 2) + 15, // Raio um pouco maior que o logo
      0, 
      Math.PI * 2
    );
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    
    // Adiciona uma borda sutil ao redor do circulo branco (Opcional, cor verde oficial)
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#4caf50'; 
    ctx.stroke();

    // 7. Desenha a logo oficial no centro
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

    // 8. Salva o arquivo final fundido
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    out.on('finish', () => {
      console.log('✅ QR Code com Marca D\'água Oficial gerado com sucesso em:');
      console.log(outputPath);
    });

  } catch (err) {
    console.error('❌ Erro ao gerar QR Code:', err);
  }
};

generateQR();