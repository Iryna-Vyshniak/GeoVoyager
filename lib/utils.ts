import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Vector3 } from 'three';

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