// Performance monitoring and optimization utilities

import { logger } from './logger'

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()

  // Measure component render time
  measureRenderTime(componentName: string, startTime: number): void {
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    this.metrics.set(`${componentName}_render`, renderTime)
    
    logger.performance(`Component render: ${componentName}`, renderTime, {
      component: componentName,
      renderTime
    })

    // Warn if render time is too high
    if (renderTime > 100) {
      logger.warn(`Slow component render detected`, {
        component: componentName,
        renderTime,
        threshold: 100
      })
    }
  }

  // Measure API call performance
  measureApiCall(endpoint: string, startTime: number, success: boolean): void {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    this.metrics.set(`${endpoint}_api`, duration)
    
    logger.performance(`API call: ${endpoint}`, duration, {
      endpoint,
      success,
      duration
    })

    // Warn if API call is too slow
    if (duration > 5000) {
      logger.warn(`Slow API call detected`, {
        endpoint,
        duration,
        threshold: 5000
      })
    }
  }

  // Measure page load performance
  measurePageLoad(pageName: string): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart
          
          this.metrics.set(`${pageName}_load`, loadTime)
          
          logger.performance(`Page load: ${pageName}`, loadTime, {
            page: pageName,
            loadTime,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint()
          })
        }
      })
    }
  }

  // Get First Paint metric
  private getFirstPaint(): number | null {
    if (typeof window === 'undefined') return null
    
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    
    return firstPaint ? firstPaint.startTime : null
  }

  // Get First Contentful Paint metric
  private getFirstContentfulPaint(): number | null {
    if (typeof window === 'undefined') return null
    
    const paintEntries = performance.getEntriesByType('paint')
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    
    return firstContentfulPaint ? firstContentfulPaint.startTime : null
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear()
  }
}

export const performanceMonitor = new PerformanceMonitor()

// React hook for measuring component performance
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = performance.now()
  
  return {
    endRender: () => performanceMonitor.measureRenderTime(componentName, startTime)
  }
}

// Image optimization utilities
export const optimizeImage = (src: string, width?: number, height?: number): string => {
  // In a real implementation, you would use a service like Cloudinary or Next.js Image Optimization
  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', '80') // Quality
  params.set('f', 'auto') // Format
  
  return `${src}?${params.toString()}`
}

// Lazy loading utility
export const lazyLoad = (callback: () => void, options?: IntersectionObserverInit): IntersectionObserver | undefined => {
  if (typeof window === 'undefined') return undefined
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback()
        observer.unobserve(entry.target)
      }
    })
  }, options)
  
  // This would be used with a ref in a component
  return observer
}
