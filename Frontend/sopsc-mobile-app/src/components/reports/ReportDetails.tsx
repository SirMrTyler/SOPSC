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
      <ScreenContainer>
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

  const isCommunity = report.chaplainDivision === 'Community';

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.label}>Chaplain: {report.chaplain}</Text>
        {isCommunity ? (
          <>
            {report.clientName && (
              <Text style={styles.label}>Client: {report.clientName}</Text>
            )}
            {report.clientPhone && (
              <Text style={styles.label}>Client Phone: {report.clientPhone}</Text>
            )}
            <Text style={styles.label}>
              Hours of Service: {report.hoursOfService ?? 'N/A'}
            </Text>
            <Text style={styles.label}>
              Commute Time: {report.commuteTime ?? 'N/A'}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>Agency: {report.primaryAgency}</Text>
            <Text style={styles.label}>
              Type of Service: {report.typeOfService}
            </Text>
            <Text style={styles.label}>Contact: {report.contactName}</Text>
            {report.pocPhone && (
              <Text style={styles.label}>Phone: {report.pocPhone}</Text>
            )}
            {report.pocEmail && (
              <Text style={styles.label}>Email: {report.pocEmail}</Text>
            )}
          </>
        )}
        {report.dispatchTime && (
          <Text style={styles.label}>
            Dispatch Time: {report.dispatchTime}
          </Text>
        )}
        {report.arrivalTime && (
          <Text style={styles.label}>Arrival Time: {report.arrivalTime}</Text>
        )}
        {report.addressDestination && (
          <Text style={styles.label}>
            Destination: {report.addressDestination}
            {report.cityDestination ? `, ${report.cityDestination}` : ''}
          </Text>
        )}
        {typeof report.milesDriven === 'number' && (
          <Text style={styles.label}>Miles Driven: {report.milesDriven}</Text>
        )}
        <Text style={styles.label}>Narrative: {report.narrative}</Text>
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
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    color: 'white',
    marginBottom: 8,
  },
  loading: {
    color: 'white',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default ReportDetails;
