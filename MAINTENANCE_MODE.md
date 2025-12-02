# Maintenance Mode Guide

## Overview

The maintenance mode system allows you to display a maintenance banner on the landing page instead of the guest login button. This is useful during deployments, API updates, or planned downtime.

**Features**:
- ✅ Toggle maintenance mode with a single boolean
- ✅ Live uptime/downtime timer (updates every second)
- ✅ Deployment timestamp tracking
- ✅ Optional custom messages
- ✅ Beautiful UI that matches the site design
- ✅ Background slideshow continues during maintenance

---

## How to Enable Maintenance Mode

### Step 1: Open Configuration File

Edit the file: `src/config/maintenance.ts`

### Step 2: Update Configuration

```typescript
export const maintenanceConfig: MaintenanceConfig = {
  // Set to true to enable maintenance mode
  enabled: true,

  // Update this to the current timestamp when you deploy
  deploymentTime: new Date().toISOString(), // e.g., '2025-12-02T15:30:00.000Z'

  // Optional: Add a custom message
  message: 'We are performing scheduled maintenance. Expected completion: 30 minutes.',

  // Optional: Set estimated completion time
  estimatedCompletion: '2025-12-02T16:00:00.000Z',
};
```

### Step 3: Deploy

```bash
npm run build
# Deploy to your hosting platform
```

---

## How to Disable Maintenance Mode

### Step 1: Update Configuration

```typescript
export const maintenanceConfig: MaintenanceConfig = {
  // Set to false to disable maintenance mode
  enabled: false,

  // Update this to the timestamp when you brought the site back up
  deploymentTime: new Date().toISOString(), // Current timestamp

  // Remove custom messages
  message: undefined,
  estimatedCompletion: undefined,
};
```

### Step 2: Deploy

The banner will automatically switch from "Under Maintenance" (orange) to "System Online" (green), and the timer will show uptime instead of downtime.

---

## What Users See

### During Maintenance (`enabled: true`)

**Display**:
- 🟠 **Orange construction icon**
- **"Under Maintenance"** heading
- Custom message (if set) or default message
- **"Downtime: 5m 23s"** - Live countdown from deployment time
- Estimated completion time (if set)
- Guest login button is **hidden**
- Login with username/password still works (via navigation)

**Example**:
```
┌────────────────────────────────────┐
│  🔧  Under Maintenance             │
│                                     │
│  We are currently performing       │
│  maintenance. Please check back    │
│  soon.                              │
│                                     │
│  🕐 Downtime: 15m 42s               │
│                                     │
│  Estimated completion: 4:00 PM     │
└────────────────────────────────────┘
```

### After Maintenance (`enabled: false`)

**Display**:
- 🟢 **Green activity icon**
- **"System Online"** heading
- "All systems operational" message
- **"Uptime: 2d 5h"** - Time since last deployment
- Normal guest login button appears

**Example**:
```
┌────────────────────────────────────┐
│  📊  System Online                 │
│                                     │
│  All systems operational           │
│                                     │
│  🕐 Uptime: 2d 5h                  │
└────────────────────────────────────┘
```

---

## Uptime Timer Format

The timer automatically formats the duration in human-readable format:

| Duration       | Display        |
|----------------|----------------|
| < 1 minute     | `34s`          |
| < 1 hour       | `5m 23s`       |
| < 24 hours     | `3h 45m`       |
| ≥ 24 hours     | `2d 5h`        |

---

## Use Cases

### 1. Planned Deployment

```typescript
// Before deployment
{
  enabled: true,
  deploymentTime: '2025-12-02T15:30:00.000Z',
  message: 'Deploying new features. Back in 15 minutes!',
  estimatedCompletion: '2025-12-02T15:45:00.000Z'
}

// After deployment succeeds
{
  enabled: false,
  deploymentTime: '2025-12-02T15:42:00.000Z', // Actual completion time
  message: undefined,
  estimatedCompletion: undefined
}
```

### 2. API Maintenance

```typescript
{
  enabled: true,
  deploymentTime: new Date().toISOString(),
  message: 'Database maintenance in progress. Read-only mode active.',
  estimatedCompletion: undefined // Unknown duration
}
```

### 3. Emergency Downtime

```typescript
{
  enabled: true,
  deploymentTime: new Date().toISOString(),
  message: 'We are experiencing technical difficulties. Working to resolve.',
  estimatedCompletion: undefined
}
```

### 4. Show Uptime (Normal Operation)

```typescript
{
  enabled: false,
  deploymentTime: '2025-12-02T15:30:00.000Z', // Last deployment
  message: undefined,
  estimatedCompletion: undefined
}
```

---

## Configuration Reference

### `MaintenanceConfig` Interface

```typescript
interface MaintenanceConfig {
  /**
   * Whether maintenance mode is currently active
   * - true: Shows "Under Maintenance" banner
   * - false: Shows "System Online" banner (or guest login if not authenticated)
   */
  enabled: boolean;

  /**
   * The timestamp when the current deployment went live (ISO 8601)
   * Used to calculate uptime/downtime duration
   *
   * Examples:
   * - new Date().toISOString() → "2025-12-02T15:30:00.000Z"
   * - Manual: "2025-12-02T15:30:00.000Z"
   */
  deploymentTime: string;

  /**
   * Optional: Custom message to display during maintenance
   * If not provided, shows default message
   */
  message?: string;

  /**
   * Optional: Estimated time when maintenance will complete
   * Displayed in user's local timezone
   */
  estimatedCompletion?: string;
}
```

---

## Helper Functions

### `getUptimeSeconds()`

Returns the number of seconds since deployment.

```typescript
const seconds = getUptimeSeconds(); // 3125 (52 minutes 5 seconds)
```

### `formatUptime(seconds)`

Formats seconds into human-readable duration.

```typescript
formatUptime(34);     // "34s"
formatUptime(305);    // "5m 5s"
formatUptime(13500);  // "3h 45m"
formatUptime(183600); // "2d 3h"
```

### `getTimerLabel()`

Returns "Uptime" or "Downtime" based on maintenance mode.

```typescript
// enabled: true
getTimerLabel(); // "Downtime"

// enabled: false
getTimerLabel(); // "Uptime"
```

---

## Best Practices

### 1. Always Update `deploymentTime`

Update this timestamp every time you deploy, whether enabling or disabling maintenance mode.

```typescript
// ✅ Good - always update
deploymentTime: new Date().toISOString()

// ❌ Bad - stale timestamp
deploymentTime: '2025-11-01T00:00:00.000Z' // From last month!
```

### 2. Set Realistic Completion Estimates

Only set `estimatedCompletion` if you have a good estimate. It's better to not set it than to set an inaccurate one.

```typescript
// ✅ Good - known maintenance window
estimatedCompletion: '2025-12-02T16:00:00.000Z'

// ✅ Good - unknown duration
estimatedCompletion: undefined

// ❌ Bad - wildly optimistic
estimatedCompletion: '2025-12-02T15:31:00.000Z' // 1 minute from now!
```

### 3. Test Before Deploying

Always test maintenance mode locally before deploying to production:

```bash
# Enable maintenance mode in src/config/maintenance.ts
npm run dev

# Open http://localhost:5173
# Verify banner appears correctly
```

### 4. Coordinate with API Downtime

If the API is down, enable maintenance mode so users don't see error messages:

1. Take API offline
2. Enable maintenance mode in frontend
3. Deploy frontend
4. Perform API maintenance
5. Bring API back online
6. Disable maintenance mode
7. Deploy frontend

---

## Troubleshooting

### Timer Not Updating

**Problem**: Timer shows the same time and doesn't increment.

**Solution**: Check that the `deploymentTime` is a valid ISO 8601 date string:

```typescript
// ✅ Correct
deploymentTime: '2025-12-02T15:30:00.000Z'

// ❌ Incorrect
deploymentTime: '12/02/2025 3:30 PM'
```

### Banner Not Showing

**Problem**: Maintenance banner doesn't appear even with `enabled: true`.

**Solution**: Make sure you're logged out. The banner only shows to unauthenticated users.

```typescript
// Banner only shows when:
!isAuthenticated && maintenanceConfig.enabled === true
```

### Wrong Uptime Displayed

**Problem**: Uptime shows wrong duration.

**Solution**: Update `deploymentTime` to match when you actually deployed:

```typescript
// If you deployed at 3:30 PM but forgot to update:
deploymentTime: new Date().toISOString() // Use current time

// Better: use the actual deployment time
deploymentTime: '2025-12-02T15:30:00.000Z' // Exact deploy time
```

---

## Version History

**v1.2.1** - Initial implementation
- Added maintenance mode configuration
- Created MaintenanceBanner component
- Integrated with Landing page
- Added live uptime/downtime timer
- Added icons (clock, activity, construction)

---

## Files Modified

- `src/config/maintenance.ts` - Configuration file
- `src/components/molecules/MaintenanceBanner.tsx` - Banner component
- `src/components/molecules/index.ts` - Export MaintenanceBanner
- `src/components/atoms/Icon.tsx` - Added clock, activity, construction icons
- `src/pages/Landing.tsx` - Integrated maintenance banner
- `MAINTENANCE_MODE.md` - This documentation

---

## Future Enhancements

Possible improvements for future versions:

- [ ] Environment variable for maintenance mode (easier deployment)
- [ ] Admin panel toggle for maintenance mode (no code changes needed)
- [ ] Scheduled maintenance (auto-enable at specific time)
- [ ] Multiple maintenance banners (different messages for different pages)
- [ ] Email notifications when maintenance mode is enabled
- [ ] Status page integration (e.g., status.plixo.com)
- [ ] Maintenance history log
- [ ] Automatically detect API downtime and enable maintenance mode

---

**Questions?** Update this file with answers as needed!
