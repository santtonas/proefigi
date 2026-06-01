// src/utils/getCroppedImg.ts

/**
 * Cria um objeto de imagem a partir de uma URL de imagem Base64.
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // Ajuda com problemas de CORS se necessário
    image.src = url;
  });

/**
 * Pega uma imagem, as coordenadas de corte (pixelCrop) e devolve a imagem recortada em Base64.
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Não foi possível obter o contexto 2D do canvas');
  }

  // Define o tamanho do canvas para o tamanho do recorte
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Desenha a imagem cortada no canvas
  // Parâmetros: imagem, origemX, origemY, origemW, origemH, destinoX, destinoY, destinoW, destinoH
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Converte o canvas de volta para Base64
  return canvas.toDataURL('image/jpeg');
}