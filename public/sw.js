// Service Worker for VERTICAL LEISURE - Offline Support
const CACHE_NAME = 'vertical-leisure-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/floors/floor1.png',
  '/floors/floor2.png',
  '/floors/floor3.png',
  '/floors/floor4.png',
  '/floors/floor5.png',
  '/floors/floor6.png',
  '/floors/floor7.png',
  '/floors/floor8.png',
  '/floors/floor9.png',
  '/floors/floor10.png',
  '/floors/floor11.png',
  '/floors/floor12.png',
  '/floors/floor13.png',
  '/floors/floor14.png',
  '/floors/floor15.png',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('VERTICAL LEISURE: Caching static assets')
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return
  
  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse
        }
        
        // Not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone the response
            const responseToCache = response.clone()
            
            // Add to cache for future
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
            
            return response
          })
          .catch(() => {
            // Offline fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/')
            }
            return null
          })
      })
  )
})

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
