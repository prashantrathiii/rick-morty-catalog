import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../store/hooks';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { current, history } = useAppSelector((s) => s.lifecycle);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 16) },
      ]}>
      <Text style={styles.title}>Rick and Morty catalog</Text>
      <Text style={styles.p}>
        This sample app loads characters from the public Rick and Morty API,
        supports search and infinite scrolling, and keeps the list in Redux
        with persistence across launches.
      </Text>
      <Text style={styles.section}>App lifecycle</Text>
      <Text style={styles.p}>
        The current state below is updated from React Native&apos;s{' '}
        <Text style={styles.mono}>AppState</Text> API (foreground, background,
        inactive).
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current</Text>
        <Text style={styles.cardValue}>{current}</Text>
      </View>
      <Text style={styles.subheading}>Recent transitions</Text>
      {history.length === 0 ? (
        <Text style={styles.muted}>No transitions recorded yet.</Text>
      ) : (
        history.map((h, i) => (
          <Text key={`${h.at}-${i}`} style={styles.historyLine}>
            {new Date(h.at).toLocaleTimeString()} — {h.state}
          </Text>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  section: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  subheading: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  p: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#111',
  },
  card: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  cardLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  historyLine: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  muted: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
