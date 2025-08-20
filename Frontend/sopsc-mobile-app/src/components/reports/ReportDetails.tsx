import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import ScreenContainer from '../navigation/ScreenContainer';
import * as reportService from '../../services/reportService';
import { RootStackParamList } from '../../../App';

type DetailsRouteProp = RouteProp<RootStackParamList, 'ReportDetails'>;

const ReportDetails: React.FC = () => {
  const route = useRoute<DetailsRouteProp>();
  const { id } = route.params;
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    reportService
      .getById(id)
      .then((data) => setReport(data.item))
      .catch((err) => console.error('[ReportDetails] Failed to load report:', err));
  }, [id]);

  if (!report) {
    return (
      <ScreenContainer showBack title="Report Details" showBottomBar={false}>
        <View style={styles.loading}><Text style={styles.loadingText}>Loading...</Text></View>
      </ScreenContainer>
    );
  }

  const isCommunity = report.division === 'Community';

  return (
    <ScreenContainer showBack title="Report Details" showBottomBar={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{report.division} Division Report</Text>
        <Text style={styles.label}>Created By:</Text>
        <Text style={styles.value}>{report.createdByName}</Text>
        <Text style={styles.value}>{report.createdByEmail}</Text>
        <Text style={styles.value}>{report.createdByPhone}</Text>

        {isCommunity ? (
          <>
            <Text style={styles.label}>Client: {report.clientName} | Client Phone: {report.clientPhone}</Text>
            <Text style={styles.label}>Client Address: {report.clientAddress}</Text>
            <Text style={styles.label}>Service Description:</Text>
            <Text style={styles.value}>{report.description}</Text>
            <Text style={styles.label}>Time Served: {report.timeServed}</Text>
            <Text style={styles.label}>Miles Driven: {report.milesDriven}</Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>Primary Agency Served: {report.primaryAgencyServed}</Text>
            {report.otherAgenciesServed && (
              <Text style={styles.label}>Other Agencies Served: {report.otherAgenciesServed}</Text>
            )}
            <Text style={styles.label}>Primary POC: {report.pocName} | POC Phone: {report.pocPhone}</Text>
            <Text style={styles.label}>Type(s) of Service: {report.serviceType}</Text>
            <Text style={styles.label}>Time Chaplain Left: {report.timeChaplainLeft}</Text>
            <Text style={styles.label}>Dispatch Start Time: {report.dispatchStartTime} Dispatch End Time: {report.dispatchEndTime}</Text>
            <Text style={styles.label}>Time Chaplain Returned Home/Finished Commute Back: {report.timeChaplainReturned}</Text>
            <Text style={styles.label}>Dispatch Address: {report.dispatchAddress}</Text>
            <Text style={styles.label}>Service Description:</Text>
            <Text style={styles.value}>{report.description}</Text>
            <Text style={styles.label}>Hours Served: {report.hoursServed}</Text>
            <Text style={styles.label}>Commute Time: {report.commuteTime}</Text>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: 'white' },
  content: { padding: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  label: { color: 'white', marginTop: 8, fontWeight: 'bold' },
  value: { color: 'white', marginTop: 4 },
});

export default ReportDetails;
