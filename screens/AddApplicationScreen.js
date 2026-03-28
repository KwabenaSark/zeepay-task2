import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Menu,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import axios from 'axios';

import { API_BASE_URL } from '../src/config';
import { addList } from '../src/api/applications';

const STATUS_OPTIONS = ['Applied', 'Pending', 'Interview', 'Offered', 'Rejected'];

const EMPTY_FORM = { companyName: '', jobTitle: '', status: '', jobLink: '' };

export default function AddApplicationScreen() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [menuVisible, setMenuVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSubmitted(false);
    try {
      await addList(formData);
      setSubmitted(true);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Application</Text>
        <Text style={styles.subtitle}>Fill in the details and submit.</Text>

        <TextInput
          label="Company Name"
          mode="outlined"
          value={formData.companyName}
          onChangeText={(val) => handleChange('companyName', val)}
          style={styles.input}
        />

        <TextInput
          label="Job Title"
          mode="outlined"
          value={formData.jobTitle}
          onChangeText={(val) => handleChange('jobTitle', val)}
          style={styles.input}
        />

        {/* Status dropdown */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableRipple onPress={() => setMenuVisible(true)} style={styles.input}>
              <View pointerEvents="none">
                <TextInput
                  label="Status"
                  mode="outlined"
                  value={formData.status}
                  editable={false}
                  right={<TextInput.Icon icon="chevron-down" />}
                />
              </View>
            </TouchableRipple>
          }
        >
          {STATUS_OPTIONS.map((opt) => (
            <Menu.Item
              key={opt}
              title={opt}
              onPress={() => {
                handleChange('status', opt);
                setMenuVisible(false);
              }}
            />
          ))}
        </Menu>

        <TextInput
  label="Job Link"
  mode="outlined"
  value={formData.jobLink}
  onChangeText={(val) => handleChange('jobLink', val)}
  placeholder="https://..."
  style={styles.input}
  autoCapitalize="none"
  keyboardType="url"
  error={formData.jobLink.length > 0 && !formData.jobLink.startsWith('https://')}
  helperText="Link must start with https://"
/>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>

        {submitted && (
          <Text style={styles.success}>✓ Application added successfully!</Text>
        )}
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}







//style
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 24 },
  input: { marginBottom: 16 },
  button: { borderRadius: 10, marginTop: 8 },
  buttonContent: { paddingVertical: 6 },
  buttonLabel: { fontSize: 15, fontWeight: '600' },
  success: { marginTop: 16, color: '#16a34a', fontWeight: '600', fontSize: 15 },
  error: { marginTop: 16, color: '#b91c1c', fontSize: 15 },
});