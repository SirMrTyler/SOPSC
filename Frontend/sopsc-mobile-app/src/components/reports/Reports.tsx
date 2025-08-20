import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PlusIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../navigation/ScreenContainer';
import * as reportService from '../../services/reportService';

const Reports: React.FC = () => {
  const navigation = useNavigation<any>();
  const [reports, setReports] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const loadReports = async () => {
    try {
      const data = await reportService.getReports(pageIndex, pageSize);
      if (Array.isArray(data?.items)) {
        setReports(data.items);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error('[Reports] Failed to load reports:', err);
    }
  };

  useEffect(() => {
    loadReports();
  }, [pageIndex, pageSize]);

  return (
    <ScreenContainer title="Reports">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {reports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.card}
              onPress={() => navigation.navigate('ReportDetails', { id: report.id })}
            >
              <Text style={styles.creator}>{report.createdByName}</Text>
              <Text style={styles.date}>{new Date(report.dateCreated).toLocaleDateString()}</Text>
              {report.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {report.description}
                </Text>
              )}
              <Text style={styles.meta}>Agency: {report.primaryAgencyServed}</Text>
              <Text style={styles.meta}>Service: {report.serviceType}</Text>
              <Text style={styles.meta}>Hours: {report.hoursServed}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setPageIndex(Math.max(pageIndex - 1, 0))}
            disabled={pageIndex === 0}
          >
            <Text style={[styles.pageButton, pageIndex === 0 && styles.disabled]}>Prev</Text>
          </TouchableOpacity>
          <Text style={styles.pageInfo}>Page {pageIndex + 1}</Text>
          <TouchableOpacity onPress={() => setPageIndex(pageIndex + 1)}>
            <Text style={styles.pageButton}>Next</Text>
          </TouchableOpacity>
          <Picker
            selectedValue={pageSize}
            onValueChange={(value) => {
              setPageIndex(0);
              setPageSize(value);
            }}
            style={styles.picker}
          >
            <Picker.Item label="10" value={10} />
            <Picker.Item label="20" value={20} />
            <Picker.Item label="50" value={50} />
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('ReportForm')}
        >
          <PlusIcon color="white" size={24} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 80 },
  card: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  creator: { fontWeight: 'bold', color: '#0a2a63' },
  date: { color: '#0a2a63', marginBottom: 4 },
  description: { color: '#333' },
  meta: { color: '#555', fontSize: 12 },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  pageButton: { color: 'white', paddingHorizontal: 8 },
  disabled: { opacity: 0.5 },
  pageInfo: { color: 'white' },
  picker: { width: 80, color: 'white' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#0a2a63',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default Reports;
