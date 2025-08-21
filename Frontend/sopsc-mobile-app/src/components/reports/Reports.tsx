import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import ScreenContainer from '../navigation/ScreenContainer';
import * as reportService from '../../services/reportService';
import { Report } from '../../types/report';
import ReportForm from './ReportForm';
import { useAuth } from '../../hooks/useAuth';
import { TrashIcon } from 'react-native-heroicons/outline';

const Reports: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [reports, setReports] = useState<Report[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { user } = useAuth();
  const divisionId = (user as any)?.divisionId;
  const isAdmin = user?.Roles?.some(
    (r) => r.roleName === 'Admin' || r.roleName === 'Administrator'
  );

  const load = async () => {
    try {
      setLoading(true);
      const data = await reportService.getAll(pageIndex, pageSize, divisionId);
      const newItems: Report[] = data.item?.pagedItems || [];
      setReports(
        newItems.sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [pageIndex, pageSize, divisionId]);

  const refreshReports = async () => {
    await load();
    setSelectedIds([]);
    setPageIndex(0);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    try {
      await reportService.removeBatch(selectedIds);
      await refreshReports();
    } catch (err) {
      console.error(err);
    }
  };

  const renderReport = (item: Report) => {
    const selected = selectedIds.includes(item.reportId);
    const formattedDate = new Date(item.dateCreated).toLocaleDateString();
    const canModify = isAdmin || user?.userId === item.createdById;
    return (
      <View
        key={item.reportId}
        style={[styles.cardContainer, selected && styles.selectedCard]}
      >
        <View style={styles.metaRow}>
          <Text style={styles.metaDate}>{formattedDate}</Text>
          <Text style={styles.metaHours}>
            Hours: {item.hoursOfService ?? 'N/A'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (selectedIds.length > 0) {
              if (canModify) toggleSelect(item.reportId);
            } else {
              navigation.navigate('ReportDetails', {
                reportId: item.reportId,
              });
            }
          }}
          onLongPress={() => canModify && toggleSelect(item.reportId)}
          activeOpacity={0.8}
        >
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.header}>Chaplain:</Text>
              <Text style={styles.body}>{item.chaplain}</Text>
              <View style={styles.rowRight}>
                <Text style={styles.header}>Division:</Text>
                <Text style={styles.divisionBody}>{item.chaplainDivision}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.leftRow}>
                <Text style={styles.header}>Agency:</Text>
                <Text style={styles.body}>{item.primaryAgency}</Text>
              </View>
              <Text style={styles.type}>Type: {item.typeOfService}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.controls}>
        <View style={styles.pageSizeRow}>
          <Text style={styles.controlLabel}>Page Size:</Text>
          {['10', '25', 'All'].map((size) => {
            const numeric = size === 'All' ? 9999 : parseInt(size, 10);
            const active = pageSize === numeric;
            return (
              <TouchableOpacity
                key={size}
                style={[styles.sizeButton, active && styles.sizeButtonActive]}
                onPress={() => handlePageSizeChange(numeric)}
              >
                <Text style={styles.sizeText}>{size}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.arrows}>
          <TouchableOpacity
            onPress={() => setPageIndex((p) => Math.max(0, p - 2))}
          >
            <Text style={styles.arrowText}>{'<<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPageIndex((p) => Math.max(0, p - 1))}
          >
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPageIndex((p) => p + 1)}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPageIndex((p) => p + 2)}>
            <Text style={styles.arrowText}>{'>>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {reports.map((r) => renderReport(r))}
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
      {selectedIds.length > 0 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteSelected}
        >
          <TrashIcon color="white" size={24} />
        </TouchableOpacity>
      )}
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
    gap: 4,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftArrows: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  pageSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sizeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sizeButtonActive: {
    backgroundColor: '#007bff',
  },
  sizeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  arrows: {
    flexDirection: 'row',
    gap: 12,
  },
  arrowText: {
    color: 'white',
    fontSize: 18,
  },
  cardContainer: {
    position: 'relative',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 8,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  header: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 4,
  },
  body: {
    color: 'white',
    marginRight: 8,
  },
  divisionBody: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  type: {
    color: 'white',
    marginLeft: 'auto',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaDate: {
    color: 'white',
    fontSize: 12,
  },
  metaHours: {
    color: 'white',
    fontSize: 12,
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
  deleteButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#dc3545',
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

