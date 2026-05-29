import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'Scriptorium Bible App',
                short_name: 'Scriptorium',
                description: 'A comprehensive Bible study platform with 502-day chronological reading plan',
                theme_color: '#1e40af',
                background_color: '#f8fafc',
                display: 'standalone',
                orientation: 'portrait-primary',
                scope: '/',
                start_url: '/',
                categories: ['education', 'books', 'lifestyle'],
                icons: [
                    {
                        src: '/icons/icon-192x192.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml'
                    },
                    {
                        src: '/icons/icon-512x512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml'
                    },
                    {
                        src: '/icons/icon-512x512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ],
                screenshots: [
                    {
                        src: '/screenshots/dashboard.png',
                        sizes: '1280x720',
                        type: 'image/png',
                        form_factor: 'wide',
                        label: 'Dashboard'
                    }
                ]
            },
            workbox: {
                // Cache strategies
                runtimeCaching: [
                    {
                        // Cache Bible API responses
                        urlPattern: /^https:\/\/bible-api\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'bible-text-cache',
                            expiration: {
                                maxEntries: 500,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        // Cache ESV API responses
                        urlPattern: /^https:\/\/api\.esv\.org\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'esv-text-cache',
                            expiration: {
                                maxEntries: 500,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        // Cache Google Fonts
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            }
                        }
                    },
                    {
                        // Cache font files
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            }
                        }
                    },
                    {
                        // Cache images
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    }
                ],
                // Pre-cache critical assets (excluding large lexicon/commentary files)
                globPatterns: ['**/*.{css,html,ico,png,svg,woff2}'],
                // Exclude large files from precaching - they'll be loaded on-demand
                globIgnores: [
                    '**/mhcc-commentary*.js',
                    '**/hebrewLexicon*.js',
                    '**/greekLexicon*.js',
                    '**/creeds-library*.js',
                    '**/cross-references*.js',
                    '**/searchIndex*.js'
                ],
                // Increase max file size for any remaining large files
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5 MB
            },
            devOptions: {
                enabled: true
            }
        })
    ],
    server: {
        port: 3000,
        open: true
    }
});
