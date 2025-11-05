/**
 * Page View Tracking Hook
 * Automatically tracks page views on route changes
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsClient } from '../services/analyticsClient';
import { useAuth } from '../contexts/AuthContext';

export function usePageViewTracking() {
  const location = useLocation();
  const { user } = useAuth();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;

    // Don't track if we're on the same page
    if (currentPath === previousPath.current) {
      return;
    }

    // Track the page view
    const userRole = user?.role || 'guest';
    analyticsClient.trackPageView(currentPath, userRole);

    // Update previous path
    previousPath.current = currentPath;

    // Log for debugging (remove in production if needed)
    console.debug(`[Analytics] Page view tracked: ${currentPath} (${userRole})`);
  }, [location.pathname, user?.role]);
}
