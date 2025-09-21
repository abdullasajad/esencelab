// Service Worker for SNGCET Portal - Offline functionality and caching

const CACHE_NAME = 'sngcet-portal-v1'
const STATIC_CACHE = 'sngcet-static-v1'
const DYNAMIC_CACHE = 'sngcet-dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add other critical assets
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/jobs/,
  /\/api\/courses/,
  /\/api\/user\/profile/
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('SW: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('SW: Static assets cached')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('SW: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets
  if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request))
    return
  }

  // Handle other requests
  event.respondWith(handleStaticRequest(request))
})

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cacheName = DYNAMIC_CACHE
  
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Fallback to cache
    console.log('SW: Network failed, trying cache for:', request.url)
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline message for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'You are currently offline. Please check your connection.' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle document requests
async function handleDocumentRequest(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    // Serve cached index.html for offline navigation
    const cachedResponse = await caches.match('/')
    return cachedResponse || new Response('Offline')
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('SW: Failed to fetch:', request.url)
    
    // Return fallback for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#374151"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9CA3AF">Image unavailable</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }
    
    throw error
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

async function handleBackgroundSync() {
  // Handle queued actions when back online
  const queuedActions = await getQueuedActions()
  
  for (const action of queuedActions) {
    try {
      await processQueuedAction(action)
      await removeQueuedAction(action.id)
    } catch (error) {
      console.log('SW: Failed to process queued action:', error)
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('SW: Push received')
  
  const options = {
    body: event.data ? event.data.text() : 'New opportunity available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'sngcet-notification',
    data: {
      url: '/opportunities'
    },
    actions: [
      {
        action: 'view',
        title: 'View Opportunities'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('SNGCET Portal', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  }
})

// Helper functions for IndexedDB operations
async function getQueuedActions() {
  // Implementation for getting queued actions from IndexedDB
  return []
}

async function processQueuedAction(action) {
  // Implementation for processing queued actions
  console.log('Processing action:', action)
}

async function removeQueuedAction(actionId) {
  // Implementation for removing processed actions
  console.log('Removing action:', actionId)
}
