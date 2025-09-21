// Performance optimization utilities for SNGCET Portal

// Lazy loading utility
export const lazyLoad = (importFunc) => {
  return React.lazy(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(importFunc())
      }, 100) // Small delay to prevent flash
    })
  })
}

// Image optimization
export const optimizeImage = (src, width = 800, quality = 80) => {
  if (!src) return null
  
  // For production, you might want to use a service like Cloudinary
  // For now, we'll just return the original src
  return src
}

// Debounce utility for search inputs
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle utility for scroll events
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Local storage with expiry
export const localStorageWithExpiry = {
  set: (key, value, ttl = 3600000) => { // Default 1 hour
    const now = new Date()
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
  },
  
  get: (key) => {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) return null
    
    const item = JSON.parse(itemStr)
    const now = new Date()
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key)
      return null
    }
    return item.value
  },
  
  remove: (key) => {
    localStorage.removeItem(key)
  }
}

// Intersection Observer for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [element, setElement] = useState(null)
  
  useEffect(() => {
    if (!element) return
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [element, options])
  
  return [setElement, isIntersecting]
}

// Preload critical resources
export const preloadResources = () => {
  // Preload critical fonts
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
  ]
  
  fontLinks.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    document.head.appendChild(link)
  })
}

// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memInfo = performance.memory
    console.log('Memory Usage:', {
      used: Math.round(memInfo.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memInfo.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) + ' MB'
    })
  }
}

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
      console.log('Bundle analyzer available in development mode')
    })
  }
}

// Critical CSS inlining
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    .loading-spinner { animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .gradient-text { background: linear-gradient(to right, #6d4fe6, #a9824c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  `
  
  const style = document.createElement('style')
  style.innerHTML = criticalCSS
  document.head.appendChild(style)
}

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = ['fonts.googleapis.com', 'fonts.gstatic.com']
  
  domains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = `//${domain}`
    document.head.appendChild(link)
  })
}

// Initialize all performance optimizations
export const initializePerformanceOptimizations = () => {
  preloadResources()
  registerServiceWorker()
  inlineCriticalCSS()
  addResourceHints()
  
  // Monitor performance in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(monitorMemoryUsage, 5000)
  }
}
