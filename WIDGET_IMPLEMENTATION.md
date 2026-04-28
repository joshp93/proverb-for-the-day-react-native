# Proverb Widget Implementation

## Overview

The Proverb for the Day app now includes widget support for Android and iOS home screens. The widget displays the current day's proverb and automatically updates daily at 5:05 AM.

## Architecture

### Core Components

1. **Widget Storage Service** (`app/_services/widget-storage.ts`)
   - Persists proverb data to AsyncStorage
   - Tracks last update timestamp
   - Provides staleness checks

2. **Background Task Service** (`app/_services/widget-background-task.ts`)
   - Manages background update scheduling
   - Runs daily at 5:05 AM
   - Handles manual widget updates for testing

3. **Widget Component** (`app/_components/proverb-widget.tsx`)
   - React Native component for displaying proverbs
   - Supports multiple sizes (small, medium, large)
   - Handles loading, error, and empty states

4. **Android AppWidget** (`ProverbWidgetProvider.kt`)
   - Native Android widget provider
   - Receives proverb updates via SharedPreferences
   - Displays widget on home screen

## Features

### Daily Updates
- Scheduled background task runs at 5:05 AM daily
- Updates stored proverb in AsyncStorage and SharedPreferences
- Survives app termination (runs on boot)

### Widget Display
- Mirrored design to main ProverbCard component
- Italic font styling consistent with app
- Reference text (e.g., "Proverbs 12:15")
- Multiple size options for different use cases

### Error Handling
- Graceful fallbacks for network failures
- Stale data detection (24-hour TTL)
- Error state displays in widget UI

## Installation & Setup

### 1. Install Dependencies

Dependencies are already added to `package.json`:
- `expo-background-fetch` - Background task scheduling
- `expo-task-manager` - Task management
- `@react-native-async-storage/async-storage` - Local storage

### 2. Android Setup

#### a. Build with EAS
To create a native Android build with widget support:

```bash
npm run preandroid
npm run android
```

Or for release build:
```bash
npm run preand-release
npm run and-release
```

#### b. What's Configured

- **AndroidManifest.xml**: Added widget receiver and required permissions
- **ProverbWidgetProvider.kt**: Native widget provider implementation
- **proverb_widget.xml**: Widget layout (2x3 grid cells recommended)
- **proverb_widget_info.xml**: Widget metadata (update interval, resize modes)
- **widget_background.xml**: Widget background styling
- **String resources**: Widget UI text

### 3. iOS Setup

iOS widget support requires native WidgetKit code. For now, the app provides:
- Widget component in React Native
- Storage service for widget data
- Background task scheduling

To add native iOS widgets:
1. Create WidgetKit target in Xcode
2. Use AsyncStorage data via native bridge
3. Configure in `app.json` and `eas.json`

For detailed iOS widget implementation, see [iOS WidgetKit Documentation](https://developer.apple.com/documentation/WidgetKit).

## Usage

### From Main App

```typescript
import { saveProverbForWidget } from './app/_services/widget-storage';
import { manuallyUpdateWidget } from './app/_services/widget-background-task';

// Save current proverb to widget
await saveProverbForWidget(proverbData);

// Manually trigger widget update (useful for testing)
await manuallyUpdateWidget();
```

### Background Task Registration

The background task is automatically registered when the app first runs. To manually register:

```typescript
import { registerWidgetUpdateTask } from './app/_services/widget-background-task';

await registerWidgetUpdateTask();
```

### Widget Component in React Native

```typescript
import { ProverbWidget } from './app/_components/proverb-widget';
import { getProverbFromWidget } from './app/_services/widget-storage';

export function MyWidgetPreview() {
  const [proverb, setProverb] = useState(null);

  useEffect(() => {
    getProverbFromWidget().then(setProverb);
  }, []);

  return <ProverbWidget proverb={proverb} size="large" />;
}
```

## Testing

### Run Widget Tests

```bash
npm test -- __tests__/widget-storage.test.ts __tests__/proverb-widget.test.tsx __tests__/widget-background-task.test.ts
```

### Test Coverage

- **widget-storage.test.ts**: 
  - Storage operations (save, retrieve, clear)
  - Staleness detection
  - Error handling

- **widget-background-task.test.ts**:
  - Background task scheduling
  - Manual update functionality
  - Time calculation for 5:05 AM scheduling

- **proverb-widget.test.tsx**:
  - Component rendering states (loading, error, success)
  - Multiple size options
  - Edge cases (long text, special characters, emoji)

### Test Results
- **40 tests passing**
- Full coverage of critical paths
- Error scenarios tested

## Architecture Decisions

### Why 5:05 AM?
- 5:00 AM is a common quiet time for meditation
- 5 minutes offset allows other processes to complete

### Why AsyncStorage + SharedPreferences?
- AsyncStorage: React Native cross-platform storage
- SharedPreferences: Android native widget access
- Data synced between both storage mechanisms

### Why React Native Widget Component?
- Reusable in main app and widget preview
- Consistent styling with main app
- Easier maintenance than separate widget code

## Limitations & Future Improvements

### Current Limitations
1. **iOS**: No native home screen widget yet (requires WidgetKit)
2. **Exact Timing**: `expo-background-fetch` may not run exactly at 5:05 AM
3. **Update Frequency**: Limited to once per day (by design)

### Future Improvements
1. Implement iOS WidgetKit for native iOS widgets
2. Add widget configuration/settings screen
3. Support for multiple widget sizes
4. Widget tap action to open app to full proverb
5. Push notification reminders alongside widget updates

## Troubleshooting

### Widget Not Updating

1. **Check background task registration**:
   ```typescript
   import { isWidgetTaskRegistered } from './app/_services/widget-background-task';
   const isRegistered = await isWidgetTaskRegistered();
   console.log('Widget task registered:', isRegistered);
   ```

2. **Manual update for testing**:
   ```typescript
   import { manuallyUpdateWidget } from './app/_services/widget-background-task';
   await manuallyUpdateWidget();
   ```

3. **Check stored data**:
   ```typescript
   import { getProverbFromWidget, getWidgetLastUpdate } from './app/_services/widget-storage';
   const proverb = await getProverbFromWidget();
   const lastUpdate = await getWidgetLastUpdate();
   console.log('Stored:', { proverb, lastUpdate });
   ```

### Widget Not Showing in Launcher

1. Ensure app was built with widget support:
   ```bash
   npm run preandroid && npm run android
   ```

2. Verify widget receiver in manifest:
   - AndroidManifest.xml should have `<receiver android:name=".ProverbWidgetProvider"`

3. Restart device or rebuild app

## Dependencies

- **expo-background-fetch** (^55.0.0) - Background task scheduling
- **expo-task-manager** (^55.0.15) - Task management
- **@react-native-async-storage/async-storage** (^1.x) - Local storage

## File Structure

```
app/
├── _components/
│   ├── proverb-widget.tsx         # Widget component
│   └── themed-text.tsx
├── _services/
│   ├── widget-storage.ts          # Storage service
│   └── widget-background-task.ts  # Background task service
├── _api/
│   └── proverbs.ts
└── _models/
    └── proverb.ts

android/app/src/main/
├── java/com/proverbfortheday/app/
│   └── ProverbWidgetProvider.kt   # Android widget provider
├── res/
│   ├── layout/
│   │   └── proverb_widget.xml     # Widget layout
│   ├── drawable/
│   │   └── widget_background.xml  # Widget background
│   ├── xml/
│   │   └── proverb_widget_info.xml # Widget config
│   └── values/
│       └── strings.xml            # Widget strings
└── AndroidManifest.xml            # Widget receiver config

__tests__/
├── widget-storage.test.ts         # Storage tests
├── widget-background-task.test.ts # Background task tests
└── proverb-widget.test.tsx        # Component tests
```

## Resources

- [Expo Background Fetch Documentation](https://docs.expo.dev/versions/latest/sdk/background-fetch/)
- [Android AppWidget Developer Guide](https://developer.android.com/guide/topics/appwidgets)
- [iOS WidgetKit Documentation](https://developer.apple.com/documentation/WidgetKit)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
