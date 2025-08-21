import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ScreenContainer from '../navigation/ScreenContainer';
import * as reportService from '../../services/reportService';
import { Report } from '../../types/report';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await reportService.getAll(0, 10);
        setReports(data.item?.pagedItems || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const renderItem = ({ item }: { item: Report }) => (
    <View style={styles.item}>
      <Text style={styles.chaplain}>{item.chaplain}</Text>
      <Text style={styles.agency}>{item.primaryAgency}</Text>
      <Text style={styles.narrative} numberOfLines={2}>
        {item.narrative}
      </Text>
    </View>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.reportId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  item: {
    marginBottom: 12,
  },
  chaplain: {
    color: 'white',
    fontWeight: 'bold',
  },
  agency: {
    color: 'white',
  },
  narrative: {
    color: 'white',
  },
});

export default Reports;