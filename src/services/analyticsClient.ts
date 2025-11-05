/**
 * Analytics Client
 * Sends analytics events to the API
 * Privacy-first: no PII, server adds context
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.plixo.com';

export interface AnalyticsEventPayload {
  event: 'page_view' | 'page_exit' | 'project_view' | 'external_link' | 'contact_form' | 'session_start' | 'session_end';
  metadata?: {
    page?: string;
    projectSlug?: string;
    userRole?: 'guest' | 'user' | 'admin';
    destination?: string;
    linkText?: string;
    [key: string]: any;
  };
  metrics?: {
    count?: number;
    duration?: number;
    loadTime?: number;
    pageCount?: number;
  };
}

class AnalyticsClient {
  private enabled = true;

  /**
   * Track an analytics event
   */
  async track(payload: AnalyticsEventPayload): Promise<void> {
    if (!this.enabled) return;

    try {
      await fetch(`${API_BASE_URL}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Silently fail - analytics should never break user experience
      console.debug('[Analytics] Failed to track event:', error);
    }
  }

  /**
   * Track a page view
   */
  async trackPageView(page: string, userRole?: 'guest' | 'user' | 'admin'): Promise<void> {
    await this.track({
      event: 'page_view',
      metadata: {
        page,
        userRole,
      },
    });
  }

  /**
   * Track a project view
   */
  async trackProjectView(projectSlug: string, userRole?: 'guest' | 'user' | 'admin'): Promise<void> {
    await this.track({
      event: 'project_view',
      metadata: {
        projectSlug,
        userRole,
      },
    });
  }

  /**
   * Track an external link click
   */
  async trackExternalLink(destination: string, linkText?: string): Promise<void> {
    await this.track({
      event: 'external_link',
      metadata: {
        destination,
        linkText,
      },
    });
  }

  /**
   * Track a contact form submission
   */
  async trackContactForm(): Promise<void> {
    await this.track({
      event: 'contact_form',
    });
  }

  /**
   * Disable analytics tracking
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Enable analytics tracking
   */
  enable(): void {
    this.enabled = true;
  }
}

export const analyticsClient = new AnalyticsClient();
