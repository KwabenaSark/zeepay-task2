import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Divider, IconButton, Modal, Portal, Surface, Text, TouchableRipple } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import { API_BASE_URL } from '../src/config';
import { deleteList, fetchList } from '../src/api/applications';



export default function ListScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const selectedItem = fetched.find((item) => item.id === selectedId) ?? null;

  const load = async () => {
    if (!API_BASE_URL) {
      setError('Connect API in .env file.');
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const data = await fetchList();
      setFetched(data);
      setError(null);
    } catch (err) {
      setError('Network Problem');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  //keep in focus
  useFocusEffect(
    useCallback(() => { load(); }, [])
  );

  const onRefresh = () => { setRefreshing(true); load(); };

  const handleDelete = (id) => {
    setFetched((prev) => prev.filter((item) => item.id !== id));
    deleteList(id);
  };

  const closeModal = () => setSelectedId(null);




  //styling
  const accent = '#2563eb';

const STATUS_CONFIG = {
  Applied:   { color: '#1976d2', bg: '#e3f2fd', label: 'Applied' },
  Interview: { color: '#f57c00', bg: '#fff3e0', label: 'Interview' },
  Offered:   { color: '#388e3c', bg: '#e8f5e9', label: 'Offered' },
  Rejected:  { color: '#d32f2f', bg: '#ffebee', label: 'Rejected' },
  Pending:   { color: '#f9a825', bg: '#fffde7', label: 'Pending' },
};
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Applications List</Text>
      <Text style={styles.subtitle}>
        {fetched.length} application{fetched.length !== 1 ? 's' : ''} tracked
      </Text>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={accent} style={styles.loader} />
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {!loading && !error && fetched.length === 0 ? (
        <Text style={styles.empty}>No applications yet.</Text>
      ) : null}

      <FlatList
        data={fetched}
        keyExtractor={(item, index) => String(item.id ?? item._id ?? index)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => {
          const status = STATUS_CONFIG[item.status] ?? { color: '#757575', bg: '#f5f5f5', label: item.status ?? 'Unknown' };
          return (
            <Surface style={styles.card} elevation={0}>
              <TouchableRipple onPress={() => setSelectedId(item.id)} borderless style={styles.ripple}>
                <View style={styles.row}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberBadgeText}>{index + 1}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text variant="titleSmall" numberOfLines={1} style={styles.company}>{item.companyName}</Text>
                    <Text variant="bodySmall" numberOfLines={1} style={styles.jobTitle}>{item.jobTitle}</Text>
                  </View>
                  <View style={[styles.chip, { backgroundColor: status.bg, borderColor: status.color + '40' }]}>
                    <Text style={[styles.chipText, { color: status.color }]}>{status.label}</Text>
                  </View>
                  <IconButton
                    icon="delete-outline"
                    size={18}
                    iconColor="#bdbdbd"
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteBtn}
                  />
                </View>
              </TouchableRipple>
            </Surface>
          );
        }}
      />

      {/* Details Modal */}
      <Portal>
        <Modal
          visible={Boolean(selectedId)}
          onDismiss={closeModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Application Details</Text>
          <Divider style={styles.divider} />

          {selectedItem ? (
            <ScrollView>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Company</Text>
                <Text style={styles.detailValue}>{selectedItem.companyName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Role</Text>
                <Text style={styles.detailValue}>{selectedItem.jobTitle}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{selectedItem.status}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date Applied</Text>
                <Text style={styles.detailValue}>{selectedItem.dateApplied}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Job Link</Text>
                <Text style={styles.detailValue}>{selectedItem.jobLink}</Text>
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.detailValue}>No item selected.</Text>
          )}

          <Divider style={styles.divider} />
          <Button mode="contained" onPress={closeModal} style={styles.closeBtn}>
            Close
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a', paddingHorizontal: 20 },
  subtitle: { fontSize: 15, color: '#64748b', marginTop: 4, marginBottom: 12, paddingHorizontal: 20 },
  loader: { marginVertical: 16 },
  errorBox: { marginHorizontal: 20, backgroundColor: '#fef2f2', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#fecaca' },
  errorText: { color: '#b91c1c', fontSize: 14, lineHeight: 20 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 24, fontSize: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  card: { marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', overflow: 'hidden', backgroundColor: '#fff' },
  ripple: { borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  numberBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 },
  numberBadgeText: { fontSize: 11, fontWeight: '700', color: '#757575' },
  info: { flex: 1, minWidth: 0, marginRight: 8 },
  company: { fontWeight: '600', lineHeight: 18, color: '#1a1a1a' },
  jobTitle: { color: '#757575', marginTop: 1 },
  chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, borderWidth: 1, flexShrink: 0, marginRight: 4 },
  chipText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  deleteBtn: { margin: 0, marginLeft: 2 },
  // Modal
  modal: { backgroundColor: '#fff', marginHorizontal: 24, borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  divider: { marginVertical: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  detailLabel: { fontSize: 14, fontWeight: '600', color: '#475569', flex: 1 },
  detailValue: { fontSize: 14, color: '#0f172a', flex: 2, textAlign: 'right' },
  closeBtn: { marginTop: 8, borderRadius: 10 },
});