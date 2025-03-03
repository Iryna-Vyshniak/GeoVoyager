import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Next.js GeoVoyager',
        short_name: 'GeoVoyager',
        description: 'Embark on a mesmerizing journey across a 3D-rendered Earth',
        start_url: '/',
        display: 'standalone',
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
            {
                "src": "/web-app-manifest-192x192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "maskable"
            },
            {
                "src": "/web-app-manifest-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable"
            }
        ],
    };
}