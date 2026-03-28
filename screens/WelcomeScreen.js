import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

export default function WelcomeScreen({ navigation }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <View style={styles.hero}>
          <Surface style={[styles.logoSurface, { backgroundColor: theme.colors.primary }]} elevation={2}>
            <Text variant="labelLarge" style={[styles.logoMark, { color: theme.colors.onPrimary }]}>
              JT
            </Text>
          </Surface>
          <Text variant="headlineLarge" style={styles.title}>
            Job Track
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Welcome
          </Text>
        </View>

        <View style={styles.footer}>
          <Button mode="contained" onPress={() => navigation.replace('Main')} contentStyle={styles.buttonContent} style={styles.button}>
            Get started
          </Button>
          <Text variant="bodySmall" style={[styles.hint, { color: theme.colors.outline }]}>
            By Kwabena Sarkodieh
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between' },
  hero: { flex: 1, justifyContent: 'center' },
  logoSurface: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoMark: { fontSize: 24, fontWeight: '800', letterSpacing: 1 },
  title: { marginBottom: 12, fontWeight: '800' },
  footer: { paddingBottom: 20 },
  button: { borderRadius: 14 },
  buttonContent: { paddingVertical: 8 },
  hint: { marginTop: 16, textAlign: 'center', lineHeight: 20 },
});
