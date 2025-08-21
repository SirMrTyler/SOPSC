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
            {report.contactPhone && (
              <Text style={styles.label}>
                Phone: {report.contactPhone}
              </Text>
            )}
            {report.contactEmail && (
              <Text style={styles.label}>
                Email: {report.contactEmail}
              </Text>
            )}
          </>
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
