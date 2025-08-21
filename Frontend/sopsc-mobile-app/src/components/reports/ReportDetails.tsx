import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenContainer from '../navigation/ScreenContainer';
import * as reportService from '../../services/reportService';
import type { Report } from '../../types/report';
import { useAuth } from '../../hooks/useAuth';

const ReportDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { reportId } = route.params as { reportId: number };
  const [report, setReport] = useState<Report | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await reportService.getById(reportId);
        setReport(data.item);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [reportId]);

  if (!report) {
    return (
      <ScreenContainer showBack title="SOPSC" showBottomBar={false}>
        <Text style={styles.loading}>Loading...</Text>
      </ScreenContainer>
    );
  }

  const isAdmin = user?.Roles?.some(
    (r) => r.roleName === 'Admin' || r.roleName === 'Administrator'
  );
  const canModify = !!user && (user.userId === report.createdById || isAdmin);

  const handleDelete = async () => {
    if (!canModify) return;
    try {
      await reportService.remove(report.reportId);
      navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScreenContainer showBack title="SOPSC" showBottomBar={false}>
      <View style={styles.wrapper}>
        <Text style={styles.pageTitle}>Chaplain: {report.chaplain}</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowRight]}>
            <Text style={styles.header}>Hours Served:</Text>
            <Text style={styles.body}>{report.hoursOfService ?? 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.header}>Chaplain Division:</Text>
              <Text style={styles.body}>{report.chaplainDivision}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.header}>Created Date:</Text>
              <Text style={styles.body}>{report.dateCreated}</Text>
            </View>
          </View>
          <Text style={styles.header}>Narrative:</Text>
          <Text style={styles.body}>{report.narrative}</Text>
          {canModify && (
            <View style={styles.itemActions}>
              <Button
                title="Edit"
                onPress={() => navigation.navigate('Reports')}
              />
              <Button
                title="Delete"
                color="red"
                onPress={handleDelete}
              />
            </View>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  header: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 4,
  },
  body: {
    color: 'white',
    fontSize: 14,
  },
  loading: {
    color: 'white',
  },
  pageTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'white',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default ReportDetails;
