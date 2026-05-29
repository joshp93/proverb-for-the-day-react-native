import { StyleSheet, View, ViewProps } from "react-native";
import { Proverb } from "../../src/models/proverb";
import { Text } from "./themed-text";

export interface ProverbCardProps extends ViewProps {
  proverb: Proverb;
  compact?: boolean;
}

export function ProverbCard({
  proverb,
  compact = false,
  style,
  ...props
}: ProverbCardProps) {
  return (
    <View
      style={[compact ? styles.compact : styles.container, style]}
      {...props}
    >
      <Text style={compact ? styles.compactText : styles.proverbText}>
        {proverb.proverb}
      </Text>
      {proverb.citation && (
        <Text style={styles.citationText}>{proverb.citation}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  compact: {
    padding: 8,
  },
  proverbText: {
    fontSize: 40,
    fontStyle: "normal",
    lineHeight: 42,
  },
  compactText: {
    fontSize: 18,
    fontStyle: "normal",
    lineHeight: 20,
  },
  citationText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "left",
  },
});
