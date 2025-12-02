import { apiClient } from './api';

/**
 * Maintenance Mode Service
 *
 * Handles fetching and updating maintenance mode status from the API.
 * This replaces the static config file approach with dynamic database-driven settings.
 */

export interface MaintenanceMode {
  enabled: boolean;
  message: string;
  startedAt: string;
  estimatedCompletion: string;
}

export interface MaintenanceModeUpdate {
  enabled: boolean;
  message?: string;
  estimatedCompletion?: string;
}

class MaintenanceService {
  /**
   * Get current maintenance mode status (public endpoint)
   * No authentication required
   */
  async getStatus(): Promise<MaintenanceMode> {
    try {
      const { data } = await apiClient.get<{ success: boolean; data: MaintenanceMode }>(
        '/system/maintenance'
      );

      if (data.success && data.data) {
        return data.data;
      }

      throw new Error('Failed to get maintenance status');
    } catch (error) {
      console.error('Get maintenance status error:', error);
      // Return default state if API fails
      return {
        enabled: false,
        message: '',
        startedAt: '',
        estimatedCompletion: '',
      };
    }
  }

  /**
   * Get maintenance mode status (admin endpoint with full details)
   * Requires admin authentication
   */
  async getAdminStatus(): Promise<MaintenanceMode & { settings?: any[] }> {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: MaintenanceMode & { settings?: any[] }
      }>('/admin/maintenance');

      if (data.success && data.data) {
        return data.data;
      }

      throw new Error('Failed to get admin maintenance status');
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Admin access required');
      }
      throw error;
    }
  }

  /**
   * Update maintenance mode (admin only)
   * Requires admin authentication
   */
  async update(update: MaintenanceModeUpdate): Promise<MaintenanceMode> {
    try {
      const { data } = await apiClient.post<{
        success: boolean;
        data: MaintenanceMode;
        message: string;
      }>('/admin/maintenance', update);

      if (data.success && data.data) {
        return data.data;
      }

      throw new Error('Failed to update maintenance mode');
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Admin access required');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.error || 'Invalid request');
      }
      throw new Error(error.response?.data?.error || 'Failed to update maintenance mode');
    }
  }

  /**
   * Enable maintenance mode
   */
  async enable(message?: string, estimatedCompletion?: string): Promise<MaintenanceMode> {
    return this.update({
      enabled: true,
      message: message || 'Site is currently under maintenance',
      estimatedCompletion: estimatedCompletion || '',
    });
  }

  /**
   * Disable maintenance mode
   */
  async disable(): Promise<MaintenanceMode> {
    return this.update({
      enabled: false,
    });
  }
}

export const maintenanceService = new MaintenanceService();
