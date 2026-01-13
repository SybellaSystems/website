// Analytics and tracking utilities

import { logger } from './logger'

interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  customParameters?: Record<string, any>
}

class Analytics {
  private isEnabled: boolean = process.env.NODE_ENV === 'production'
  private sessionId: string = this.generateSessionId()

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Track page views
  trackPageView(pageName: string, pageUrl: string): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      event: 'page_view',
      category: 'Navigation',
      action: 'Page View',
      label: pageName,
      customParameters: {
        page_url: pageUrl,
        session_id: this.sessionId,
        timestamp: new Date().toISOString()
      }
    }

    this.sendEvent(event)
    
    logger.info('Page view tracked', {
      page: pageName,
      url: pageUrl,
      sessionId: this.sessionId
    })
  }

  // Track user interactions
  trackInteraction(category: string, action: string, label?: string, value?: number): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      event: 'interaction',
      category,
      action,
      label,
      value,
      customParameters: {
        session_id: this.sessionId,
        timestamp: new Date().toISOString()
      }
    }

    this.sendEvent(event)
    
    logger.userInteraction(`${category}: ${action}`, {
      label,
      value,
      sessionId: this.sessionId
    })
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, errorMessage?: string): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      event: 'form_submission',
      category: 'Forms',
      action: success ? 'Form Submitted' : 'Form Error',
      label: formName,
      customParameters: {
        success,
        error_message: errorMessage,
        session_id: this.sessionId,
        timestamp: new Date().toISOString()
      }
    }

    this.sendEvent(event)
    
    logger.info('Form submission tracked', {
      form: formName,
      success,
      errorMessage,
      sessionId: this.sessionId
    })
  }

  // Track business events
  trackBusinessEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      event: 'business_event',
      category: 'Business',
      action: eventName,
      customParameters: {
        ...parameters,
        session_id: this.sessionId,
        timestamp: new Date().toISOString()
      }
    }

    this.sendEvent(event)
    
    logger.info('Business event tracked', {
      event: eventName,
      parameters,
      sessionId: this.sessionId
    })
  }

  // Track performance metrics
  trackPerformance(metricName: string, value: number, unit: string = 'ms'): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      event: 'performance',
      category: 'Performance',
      action: 'Metric',
      label: metricName,
      value,
      customParameters: {
        unit,
        session_id: this.sessionId,
        timestamp: new Date().toISOString()
      }
    }

    this.sendEvent(event)
    
    logger.performance(`Analytics: ${metricName}`, value, {
      metric: metricName,
      unit,
      sessionId: this.sessionId
    })
  }

  // Send event to analytics service
  private sendEvent(event: AnalyticsEvent): void {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_map: event.customParameters
      })
    }

    // Custom analytics endpoint (replace with your actual endpoint)
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      }).catch(error => {
        logger.error('Failed to send analytics event', {
          error: error.message,
          event
        })
      })
    }
  }

  // Get session ID
  getSessionId(): string {
    return this.sessionId
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>): void {
    if (!this.isEnabled) return

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        custom_map: properties
      })
    }
  }
}

export const analytics = new Analytics()

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackBusinessEvent: analytics.trackBusinessEvent.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    getSessionId: analytics.getSessionId.bind(analytics)
  }
}
