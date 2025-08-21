import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ScreenContainer from '../navigation/ScreenContainer';
import * as reportService from '../../services/reportService';
import type { Report } from '../../types/report';

const ReportDetails: React.FC = () => {
  const route = useRoute();
  const { reportId } = route.params as { reportId: number };
  const [report, setReport] = useState<Report | null>(null);

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
});

export default ReportDetails;
