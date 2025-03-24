
import { Uint16BufferAttribute, MeshStandardMaterial, BoxGeometry, CanvasTexture, Float32BufferAttribute, RepeatWrapping, SRGBColorSpace, Vector3, Texture, Color } from 'three';
import html2canvas from 'html2canvas';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


import { TextureResult } from '@/shared/shared.types';

import { PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, PAGE_SEGMENTS, SEGMENT_WIDTH } from './constants';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// converts geographic coordinates (latitude and longitude) into Cartesian coordinates (x, y, z) for placing objects on a 3D sphere, such as a globe in Three.js or React Three Fiber
export const lon2xyz = (lat: number, lon: number, radius: number = 1): Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

export const params = {
  // general scene params
  sunIntensity: 30, // brightness of the sun
  speedFactor: 2.0, // rotation speed of the earth
  metalness: 0.1,
}


export const createPageGeometry = () => {
  const geometry = new BoxGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, PAGE_SEGMENTS, 2);
  geometry.translate(PAGE_WIDTH / 2, 0, 0);
  const position = geometry.attributes.position;
  const vertex = new Vector3();
  const skinIndexes: number[] = [];
  const skinWeights: number[] = [];

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const x = vertex.x;
    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
    const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }

  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndexes, 4));
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4));
  return geometry;
};

// Функція для створення градієнтної текстури
export const createGradientTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context || canvas.width === 0 || canvas.height === 0) {
    console.warn('createGradientTexture: canvas is empty or invalid');
    const fallback = new CanvasTexture(document.createElement('canvas'));
    fallback.colorSpace = SRGBColorSpace;
    return fallback;
  }

  // Створюємо лінійний градієнт від чорного до темно-синього та фіолетового
  const gradient = context.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(0.5, '#1a2a6c');
  gradient.addColorStop(1, '#4b0082');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

export const createTexturedMaterial = (
  texture: TextureResult | null,
  gradientTexture: Texture, // Градієнт завжди буде основною картою
  whiteColor: Color,
  emissiveColor: Color
): MeshStandardMaterial => {
  return new MeshStandardMaterial({
    color: whiteColor,
    map: gradientTexture, // використовується завжди
    ...(texture?.normal && { normalMap: texture.normal }),
    metalness: 1,
    roughness: 1,
    ...(texture?.orm && {
      metalnessMap: texture.orm,
      roughnessMap: texture.orm,
    }),
    emissive: emissiveColor,
    emissiveIntensity: 0,
  });
};




export const buildDomTextures = async (
  container: HTMLElement,
  selector: string = '',
  angle: number = 0
): Promise<{ map: CanvasTexture; orm: CanvasTexture; normal: CanvasTexture }> => {
  const element = selector ? (container.querySelector(selector) as HTMLElement) : container;
  if (!element) {
    throw new Error(`Елемент для створення текстури не знайдено: ${selector}`);
  }
  if (element.classList.contains('spine-text')) {
    element.style.backgroundColor = 'pink';

  } else if (element.classList.contains('book-front')) {
    element.style.backgroundColor = 'transparent';
    element.style.color = 'white';
  } else {
    element.style.backgroundColor = 'white';
    element.style.color = 'black';
    element.style.padding = '20px 20px 20px 80px';
  }

  element.classList.add('null');
  const albedo = await html2canvas(element, {
    useCORS: true,
    backgroundColor: element.style.backgroundColor === 'transparent' ? null : '#ffffff',
    scale: 2,
  });

  element.classList.add('orm');
  const ormCanvas = await html2canvas(element, {
    useCORS: true,
    backgroundColor: element.style.backgroundColor === 'transparent' ? null : '#ffffff',
  });
  const orm = new CanvasTexture(ormCanvas);

  element.classList.replace('orm', 'bump');
  const bumpCanvas = await html2canvas(element, {
    useCORS: true,
    backgroundColor: element.style.backgroundColor === 'transparent' ? null : '#ffffff',
  });
  const normal = new CanvasTexture(bumpToNormal(bumpCanvas));

  const map = new CanvasTexture(albedo);
  map.rotation = orm.rotation = normal.rotation = angle;
  map.wrapS = map.wrapT = orm.wrapS = orm.wrapT = normal.wrapS = normal.wrapT = RepeatWrapping;

  return { map, orm, normal };
};


export const bumpToNormal = (
  canvas: HTMLCanvasElement,
  offset: number = 1,
  intensity: number = 2
): HTMLCanvasElement => {
  const context = canvas.getContext('2d');
  if (!context || canvas.width === 0 || canvas.height === 0) {
    console.warn('bumpToNormal: canvas is empty or invalid');
    return canvas;
  }

  const src = context.getImageData(0, 0, canvas.width, canvas.height);
  const dest = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < src.data.length; i += 4) {
    //TODO this doens't resolve over the width boundary!
    const red = (src.data[i + 0] - src.data[i + 4 * offset]) * intensity;
    const green = (src.data[i + 0] - src.data[i + 4 * offset * canvas.width]) * intensity;
    const blue = 255 - Math.abs(red) - Math.abs(green);

    dest.data[i + 0] = 128 + red;
    dest.data[i + 1] = 128 + green;
    dest.data[i + 2] = blue;
    dest.data[i + 3] = 255;
  }

  context.putImageData(dest, 0, 0);
  return canvas;
};








