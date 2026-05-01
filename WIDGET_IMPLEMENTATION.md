# Proverb Widget Implementation

## Overview

The Proverb for the Day app includes widget support for Android home screens using Voltra. The widget displays the current day's proverb and updates daily via background tasks.

## Architecture

### Core Components

1. **Voltra Widget** (`app/widgets/ProverbWidget.tsx`) - Voltra-Android widget using Jetpack Compose Glance
2. **Background Task** (`app/widgets/widget-background-task.ts`) - Daily update scheduling via expo-background-task
3. **Expo Plugin** (`app.json`) - Voltra widget configuration

## Dependencies

- **voltra** (^1.4.0) - Widget and Live Activity support
- **expo-background-task** (^55.0.17) - Background task scheduling
- **expo-task-manager** (^55.0.15) - Task management
- **@react-native-async-storage/async-storage** - Local storage (if needed)

## Installation

```bash
pnpm install
npm run preandroid
npm run android
```

## File Structure

```
app/
├── _layout.tsx
├── widgets/
│   ├── ProverbWidget.tsx
│   └── widget-background-task.ts
src/
├── api/proverbs.ts
└── models/proverb.ts
```

## Testing

````bash
npm test -- __tests__/widget-background-task.test.ts
```# Proverb Widget Implementation

## Overview
The Proverb for the Day app includes widget support for Android home screens using Voltra. The widget displays the current day's proverb and updates daily via background tasks.

## Architecture

### Core Components

1. **Voltra Widget** (`app/widgets/ProverbWidget.tsx`) - Voltra-Android widget using Jetpack Compose Glance
2. **Background Task** (`app/widgets/widget-background-task.ts`) - Daily update scheduling via expo-background-task
3. **Expo Plugin** (`app.json`) - Voltra widget configuration

## Dependencies

- **voltra** (^1.4.0) - Widget and Live Activity support
- **expo-background-task** (^55.0.17) - Background task scheduling
- **expo-task-manager** (^55.0.15) - Task management
- **@react-native-async-storage/async-storage** - Local storage (if needed)

## Installation

```bash
pnpm install
npm run preandroid
npm run android
````

## File Structure

```
app/
├── _layout.tsx
├── widgets/
│   ├── ProverbWidget.tsx
│   └── widget-background-task.ts
src/
├── api/proverbs.ts
└── models/proverb.ts
```

## Testing

```bash
npm test -- __tests__/widget-background-task.test.ts
```
