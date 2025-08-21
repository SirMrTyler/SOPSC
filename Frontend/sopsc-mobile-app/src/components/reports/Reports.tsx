import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import ScreenContainer from '../navigation/ScreenContainer';
import * as reportService from '../../services/reportService';
import { Report } from '../../types/report';
import ReportForm from './ReportForm';
import { useAuth } from '../../hooks/useAuth';

const Reports: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [reports, setReports] = useState<Report[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeInput, setPageSizeInput] = useState('10');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { user } = useAuth();
  const divisionId = (user as any)?.divisionId;
  const isAdmin = user?.Roles?.some((r) => r.roleName === 'Admin' || r.roleName === 'Administrator');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAll(
          pageIndex,
          pageSize,
          divisionId
        );
        const newItems: Report[] = data.item?.pagedItems || [];
        setReports((prev) => {
          const merged =
            pageIndex === 0 ? newItems : [...prev, ...newItems];
          return merged.sort(
            (a, b) =>
              new Date(b.dateCreated).getTime() -
              new Date(a.dateCreated).getTime()
          );
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pageIndex, pageSize, divisionId]);

  const handlePageSizeChange = () => {
    const size = parseInt(pageSizeInput, 10);
    if (!isNaN(size) && size > 0) {
      setReports([]);
      setPageIndex(0);
      setPageSize(size);
    }
  };

  const handleScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom &&
      !loading
    ) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const refreshReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getAll(0, pageSize, divisionId);
      const newItems: Report[] = data.item?.pagedItems || [];
      setReports(
        newItems.sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
        )
      );
      setPageIndex(0);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: Report) => {
    if (!user || (!isAdmin && user.userId !== item.createdById)) {
      return;
    }
    try {
      await reportService.remove(item.reportId);
      await refreshReports();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <ScreenContainer>
      <View style={styles.controls}>
        <Text style={styles.controlLabel}>Page Size:</Text>
        <TextInput
          style={styles.pageInput}
          value={pageSizeInput}
          onChangeText={setPageSizeInput}
          keyboardType="numeric"
        />
        <Button title="Set" onPress={handlePageSizeChange} />
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        ref={scrollRef}
      >
        {reports.map((item) => {
          const canModify =
            isAdmin || user?.userId === item.createdById;
          return (
            <View key={item.reportId} style={styles.item}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ReportDetails', {
                    reportId: item.reportId,
                  })
                }
              >
                <Text style={styles.chaplain}>{item.chaplain}</Text>
                <Text style={styles.date}>
                  {new Date(item.dateCreated).toLocaleDateString()}
                </Text>
                <Text style={styles.narrative} numberOfLines={2}>
                  {item.narrative}
                </Text>
                <Text style={styles.agency}>Agency: {item.primaryAgency}</Text>
                <Text style={styles.type}>Service: {item.typeOfService}</Text>
                <Text style={styles.hours}>
                  Hours: {item.hoursOfService ?? 'N/A'}
                </Text>
                <Text style={styles.miles}>
                  Miles: {item.milesDriven ?? 'N/A'}
                </Text>
              </TouchableOpacity>
              {canModify && (
                <View style={styles.itemActions}>
                  <Button
                    title="Edit"
                    onPress={() => {
                      setEditing(item);
                      setShowForm(true);
                    }}
                  />
                  <Button
                    title="Delete"
                    color="red"
                    onPress={() => handleDelete(item)}
                  />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditing(null);
          setShowForm(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      {showForm && (
        <ReportForm
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={refreshReports}
          initialValues={editing || undefined}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  controlLabel: {
    color: 'white',
    marginRight: 8,
  },
  pageInput: {
    backgroundColor: 'white',
    padding: 4,
    width: 60,
    marginRight: 8,
    borderRadius: 4,
  },
  item: {
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#555',
    paddingBottom: 8,
  },
  chaplain: {
    color: 'white',
    fontWeight: 'bold',
  },
  date: {
    color: 'white',
  },
  agency: {
    color: 'white',
  },
  type: {
    color: 'white',
  },
  hours: {
    color: 'white',
  },
  miles: {
    color: 'white',
  },
  narrative: {
    color: 'white',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 24,
  },
});

export default Reports;