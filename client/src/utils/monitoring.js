// Performance monitoring and analytics for 10K students
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: 0,
      apiCalls: 0,
      errors: 0,
      userSessions: new Set(),
      performanceEntries: []
    }
    
    this.init()
  }

  init() {
    // Monitor page performance
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.monitorPageLoad()
      this.monitorResourceLoading()
      this.monitorUserInteractions()
    }
  }

  monitorPageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        const metrics = {
          timestamp: Date.now(),
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: this.getFirstPaint(),
          firstContentfulPaint: this.getFirstContentfulPaint(),
          largestContentfulPaint: this.getLargestContentfulPaint()
        }
        
        this.recordMetric('pageLoad', metrics)
        this.metrics.pageLoads++
      }
    })
  }

  monitorResourceLoading() {
    // Monitor slow loading resources
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) { // Resources taking more than 1 second
          this.recordMetric('slowResource', {
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            type: entry.initiatorType
          })
        }
      })
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }

  monitorUserInteractions() {
    // Monitor user engagement
    let interactionCount = 0
    const events = ['click', 'scroll', 'keydown', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        interactionCount++
        if (interactionCount % 10 === 0) { // Log every 10 interactions
          this.recordMetric('userEngagement', {
            interactions: interactionCount,
            timestamp: Date.now()
          })
        }
      }, { passive: true })
    })
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    return firstPaint ? firstPaint.startTime : null
  }

  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint')
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcp ? fcp.startTime : null
  }

  getLargestContentfulPaint() {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        resolve(lastEntry.startTime)
        observer.disconnect()
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // Fallback timeout
      setTimeout(() => resolve(null), 5000)
    })
  }

  recordMetric(type, data) {
    const metric = {
      type,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }
    
    this.metrics.performanceEntries.push(metric)
    
    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric)
    }
    
    // Keep only last 100 entries to prevent memory leaks
    if (this.metrics.performanceEntries.length > 100) {
      this.metrics.performanceEntries = this.metrics.performanceEntries.slice(-100)
    }
  }

  recordError(error, context = {}) {
    const errorMetric = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      url: window.location.href
    }
    
    this.recordMetric('error', errorMetric)
    this.metrics.errors++
    
    console.error('Performance Monitor - Error recorded:', errorMetric)
  }

  recordApiCall(url, method, duration, status) {
    const apiMetric = {
      url,
      method,
      duration,
      status,
      timestamp: Date.now()
    }
    
    this.recordMetric('apiCall', apiMetric)
    this.metrics.apiCalls++
    
    // Alert on slow API calls (>3 seconds)
    if (duration > 3000) {
      console.warn('Slow API call detected:', apiMetric)
    }
  }

  recordUserSession(userId) {
    this.metrics.userSessions.add(userId)
  }

  getMetrics() {
    return {
      ...this.metrics,
      activeUsers: this.metrics.userSessions.size,
      averageLoadTime: this.calculateAverageLoadTime(),
      errorRate: this.calculateErrorRate()
    }
  }

  calculateAverageLoadTime() {
    const loadTimes = this.metrics.performanceEntries
      .filter(entry => entry.type === 'pageLoad')
      .map(entry => entry.data.loadTime)
      .filter(time => time > 0)
    
    return loadTimes.length > 0 
      ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length 
      : 0
  }

  calculateErrorRate() {
    const totalEvents = this.metrics.pageLoads + this.metrics.apiCalls
    return totalEvents > 0 ? (this.metrics.errors / totalEvents) * 100 : 0
  }

  sendToAnalytics(metric) {
    // Send to your analytics service (Google Analytics, Mixpanel, etc.)
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        event_category: 'Performance',
        event_label: metric.type,
        value: metric.data.duration || 1
      })
    }
    
    // Send to custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    }).catch(err => console.warn('Failed to send analytics:', err))
  }

  // Memory usage monitoring
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memoryInfo = performance.memory
      this.recordMetric('memoryUsage', {
        usedJSHeapSize: memoryInfo.usedJSHeapSize,
        totalJSHeapSize: memoryInfo.totalJSHeapSize,
        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit
      })
    }
  }

  // Network monitoring
  monitorNetworkStatus() {
    if ('connection' in navigator) {
      const connection = navigator.connection
      this.recordMetric('networkStatus', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      })
    }
  }

  // Start continuous monitoring
  startContinuousMonitoring() {
    // Monitor memory every 30 seconds
    setInterval(() => this.monitorMemoryUsage(), 30000)
    
    // Monitor network every minute
    setInterval(() => this.monitorNetworkStatus(), 60000)
    
    // Clean up old metrics every 5 minutes
    setInterval(() => this.cleanupOldMetrics(), 300000)
  }

  cleanupOldMetrics() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    this.metrics.performanceEntries = this.metrics.performanceEntries
      .filter(entry => entry.timestamp > oneHourAgo)
  }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor()

// Start monitoring in production
if (process.env.NODE_ENV === 'production') {
  performanceMonitor.startContinuousMonitoring()
}

export default performanceMonitor
