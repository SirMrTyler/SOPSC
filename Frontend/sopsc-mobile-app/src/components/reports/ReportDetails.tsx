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

  const isCommunity = report.chaplainDivision === 'Community';

  return (
    <ScreenContainer showBack title="SOPSC" showBottomBar={false}>
      <View style={styles.wrapper}>
        <Text style={styles.pageTitle}>Chaplain: {report.chaplain}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.header}>Chaplain:</Text>
              <Text style={styles.body}>{report.chaplain}</Text>
            </View>
            {!isCommunity && (
              <View style={styles.rowRight}>
                <Text style={styles.header}>Contact:</Text>
                <Text style={styles.body}>{report.contactName}</Text>
              </View>
            )}
          </View>
          {isCommunity ? (
            <>
              {report.clientName && (
                <View style={styles.row}>
                  <Text style={styles.header}>Client:</Text>
                  <Text style={styles.body}>{report.clientName}</Text>
                </View>
              )}
              {report.clientPhone && (
                <View style={styles.row}>
                  <Text style={styles.header}>Client Phone:</Text>
                  <Text style={styles.body}>{report.clientPhone}</Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={styles.header}>Hours of Service:</Text>
                <Text style={styles.body}>{report.hoursOfService ?? 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.header}>Commute Time:</Text>
                <Text style={styles.body}>{report.commuteTime ?? 'N/A'}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.header}>Agency:</Text>
                  <Text style={styles.body}>{report.primaryAgency}</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.header}>Services:</Text>
                  <Text style={styles.body}>{report.typeOfService}</Text>
                </View>
              </View>
              {report.pocPhone && (
                <View style={styles.row}>
                  <Text style={styles.header}>Phone:</Text>
                  <Text style={styles.body}>{report.pocPhone}</Text>
                </View>
              )}
              {report.pocEmail && (
                <View style={styles.row}>
                  <Text style={styles.header}>Email:</Text>
                  <Text style={styles.body}>{report.pocEmail}</Text>
                </View>
              )}
            </>
          )}
          {report.dispatchTime && (
            <View style={styles.row}>
              <Text style={styles.header}>Dispatch Time:</Text>
              <Text style={styles.body}>{report.dispatchTime}</Text>
            </View>
          )}
          {report.arrivalTime && (
            <View style={styles.row}>
              <Text style={styles.header}>Arrival Time:</Text>
              <Text style={styles.body}>{report.arrivalTime}</Text>
            </View>
          )}
          {report.addressDestination && (
            <View style={styles.row}>
              <Text style={styles.header}>Destination:</Text>
              <Text style={styles.body}>
                {report.addressDestination}
                {report.cityDestination ? `, ${report.cityDestination}` : ''}
              </Text>
            </View>
          )}
          {typeof report.milesDriven === 'number' && (
            <View style={styles.row}>
              <Text style={styles.header}>Miles Driven:</Text>
              <Text style={styles.body}>{report.milesDriven}</Text>
            </View>
          )}
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
    flexWrap: 'wrap',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
