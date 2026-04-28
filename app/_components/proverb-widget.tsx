import { View, StyleSheet, ViewProps, ActivityIndicator } from 'react-native';
import { Text } from './themed-text';
import { Proverb } from '../_models/proverb';

export interface ProverbWidgetProps extends ViewProps {
  proverb?: Proverb | null;
  loading?: boolean;
  error?: string | null;
  size?: 'small' | 'medium' | 'large';
}

/**
 * ProverbWidget component for displaying proverbs on home screen widgets
 * Optimized for small display areas while maintaining readability
 */
export function ProverbWidget({
  proverb,
  loading = false,
  error = null,
  size = 'medium',
  style,
  ...props
}: ProverbWidgetProps) {
  const sizeStyles = {
    small: styles.smallContainer,
    medium: styles.mediumContainer,
    large: styles.largeContainer,
  };

  const textSizeStyles = {
    small: styles.smallText,
    medium: styles.mediumText,
    large: styles.largeText,
  };

  return (
    <View style={[sizeStyles[size], style]} {...props}>
      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="small" color="#333" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {error && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Unable to load proverb</Text>
        </View>
      )}

      {proverb && !loading && !error && (
        <View style={styles.centerContent}>
          <Text style={textSizeStyles[size]} numberOfLines={5}>
            {proverb.proverb}
          </Text>
          <Text style={styles.reference}>{proverb.ref}</Text>
        </View>
      )}

      {!proverb && !loading && !error && (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No proverb available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  smallContainer: {
    padding: 8,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  mediumContainer: {
    padding: 12,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  largeContainer: {
    padding: 16,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  smallText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 4,
  },
  mediumText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  largeText: {
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
  },
  reference: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#d9534f',
  },
  emptyText: {
    fontSize: 12,
    color: '#999',
  },
});
