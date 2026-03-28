import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchStats } from '../src/api/applications';

import { API_BASE_URL } from '../src/config';



export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);


    //use state
  const [stats, setStats] = useState(null);






// function to fetch data and handle errors
  const load = async () => {

    if (!API_BASE_URL) {
      setError('Connect API in .env file.');
      setLoading(false);
      setRefreshing(false);
      return;
    }
    
    try {
      const data = await fetchStats();
      setStats(data);
      
    } catch (err) {
      setError("Network Problem");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  
  useFocusEffect(
    useCallback(() => { load(); }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };


//for stlying 
const accent = '#2563eb';





  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Overview</Text>
        <Text style={styles.pageSubtitle}>Applications by status</Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={accent} style={styles.loader} />
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}



        {!loading && !error && stats ? (
          <View style={styles.container}>

          {/* Total */}
          <View style={[styles.card, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <Text style={[styles.label, { color: '#1d4ed8' }]}>Total</Text>
            <Text style={styles.number}>
              {stats?.totalApplications ?? '—'}
            </Text>
          </View>
        
          {/* Pending */}
          <View style={[styles.card, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
            <Text style={[styles.label, { color: '#b45309' }]}>Pending</Text>
            <Text style={styles.number}>
              {stats?.pending ?? '—'}
            </Text>
          </View>
        
          {/* Interviews */}
          <View style={[styles.card, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
            <Text style={[styles.label, { color: '#047857' }]}>Interviews</Text>
            <Text style={styles.number}>
              {stats?.interviews ?? '—'}
            </Text>
          </View>
        
          {/* Rejected */}
          <View style={[styles.card, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
            <Text style={[styles.label, { color: '#b91c1c' }]}>Rejected</Text>
            <Text style={styles.number}>
              {stats?.rejected ?? '—'}
            </Text>
          </View>
        
        </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  loader: {
    marginVertical: 16,
  },
  errorBox: {
    marginHorizontal: 20,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    lineHeight: 20,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    minWidth: 140,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.8,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  number: {
    fontWeight: '800',
    color: '#1a1a2e',
    marginTop: 8,
    fontSize: 28,
  },
});
