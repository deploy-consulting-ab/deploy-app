import { defaultCache } from '@serwist/next/worker';
import { Serwist, CacheFirst, NetworkFirst } from 'serwist';

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        ...defaultCache,
        // Cache images with CacheFirst strategy
        {
            matcher: ({ request }) => request.destination === 'image',
            handler: new CacheFirst({
                cacheName: 'images',
                plugins: [
                    {
                        cacheWillUpdate: async ({ response }) => {
                            return response?.status === 200 ? response : null;
                        },
                    },
                ],
            }),
        },
        // Cache API calls with NetworkFirst strategy
        {
            matcher: ({ url }) => url.pathname.startsWith('/api/'),
            handler: new NetworkFirst({
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
            }),
        },
        // Cache static assets from /images/
        {
            matcher: ({ url }) => url.pathname.startsWith('/images/'),
            handler: new CacheFirst({
                cacheName: 'static-assets',
            }),
        },
    ],
    fallbacks: {
        entries: [
            {
                url: '/~offline',
                matcher({ request }) {
                    return request.destination === 'document';
                },
            },
        ],
    },
});

serwist.addEventListeners();
