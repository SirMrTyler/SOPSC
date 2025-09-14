import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import ScreenContainer from "../Navigation/ScreenContainer";
import * as reportService from "./services/reportService";
import { Report } from "../../types/report";
import ReportForm from "./ReportForm";
import { useAuth } from "../../hooks/useAuth";
import { TrashIcon } from "react-native-heroicons/outline";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as userService from "../User/services/userService";

const Reports: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterUserId, setFilterUserId] = useState<number | null>(null);
  const [filterDivision, setFilterDivision] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const { user } = useAuth();
  const authUser: any = user;
  const divisions: string[] =
    authUser?.divisions ?? (authUser?.division ? [authUser.division] : []);
  const divisionId = (user as any)?.divisionId;
  const isAdmin = user?.Roles?.some(
    (r) => r.roleName === "Admin" || r.roleName === "Administrator"
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await userService.getAll(0, 500);
        const list = Array.isArray(data) ? data : data.item?.pagedItems || [];
        setUsers(list);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    let list = [...reports];

    if (filterUserId) {
      list = list.filter((r) => r.createdById === filterUserId);
    }
    if (filterDivision) {
      list = list.filter((r) => r.chaplainDivision === filterDivision);
    }
    if (filterDate) {
      const selected = filterDate.toDateString();
      list = list.filter(
        (r) => new Date(r.dateCreated).toDateString() === selected
      );
    }
    if (search) {
      const lower = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.chaplain?.toLowerCase().includes(lower) ||
          r.primaryAgency?.toLowerCase().includes(lower) ||
          r.typeOfService?.toLowerCase().includes(lower) ||
          r.narrative?.toLowerCase().includes(lower)
      );
    }

    setFilteredReports(list);
  }, [reports, search, filterDivision, filterUserId, filterDate]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await reportService.getAll(pageIndex, pageSize, divisionId, {
        divisionId: filterDivision || undefined,
        userId: filterUserId || undefined,
        date: filterDate ? filterDate.toISOString() : undefined,
        query: search || undefined,
      });
      const newItems: Report[] = data.item?.pagedItems || [];
      if (newItems.length === 0) {
        Alert.alert("No More Reports...");
      }
      setReports(
        newItems.sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
        )
      );
    } catch (err: any) {
      if (err?.response?.status === 404) {
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [
    pageIndex,
    pageSize,
    divisionId,
    filterDivision,
    filterUserId,
    filterDate,
    search,
  ]);

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
      <TouchableOpacity
        key={item.reportId}
        style={[styles.cardContainer, selected && styles.selectedCard]}
        onPress={() => {
          if (selectedIds.length > 0) {
            if (canModify) toggleSelect(item.reportId);
          } else {
            navigation.navigate("ReportDetails", {
              reportId: item.reportId,
            });
          }
        }}
        onLongPress={() => canModify && toggleSelect(item.reportId)}
        activeOpacity={0.8}
      >
        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.metaDate}>{formattedDate}</Text>
            <Text style={styles.metaHours}>
              Hours: {item.hoursOfService ?? "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.header}>Chaplain:</Text>
            <Text style={styles.body}>{item.chaplain}</Text>
            <View style={styles.rowRight}>
              <Text style={styles.header}>Division:</Text>
              <Text style={styles.divisionBody}>{item.chaplainDivision}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.header}>Agency:</Text>
            <Text style={styles.body}>{item.primaryAgency}</Text>
          </View>
          <Text style={styles.type}>Type: {item.typeOfService}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer showBack title="Home">
      <Text style={styles.title}>REPORTS</Text>
      <View style={styles.filters}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {filterDate ? filterDate.toLocaleDateString() : "Select Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={filterDate || new Date()}
            mode="date"
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) {
                setFilterDate(date);
                setPageIndex(0);
              }
            }}
          />
        )}
        <Picker
          selectedValue={filterUserId ?? ""}
          onValueChange={(v) => {
            setFilterUserId(v ? Number(v) : null);
            setPageIndex(0);
          }}
          style={styles.picker}
        >
          <Picker.Item label="All Users" value="" />
          {users.map((u) => (
            <Picker.Item
              key={u.userId}
              label={`${u.firstName} ${u.lastName}`}
              value={u.userId}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={filterDivision}
          onValueChange={(v) => {
            setFilterDivision(v);
            setPageIndex(0);
          }}
          style={styles.picker}
        >
          <Picker.Item label="All Divisions" value="" />
          {divisions.map((d) => (
            <Picker.Item key={d} label={d} value={d} />
          ))}
        </Picker>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor="#DED3C4"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setPageIndex(0);
            }}
          />
        </View>
      </View>
      <View style={styles.paginationRow}>
        <View style={styles.leftArrows}>
          <TouchableOpacity
            onPress={() => setPageIndex((p) => Math.max(0, p - 2))}
          >
            <Text style={styles.arrowText}>{"<<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPageIndex((p) => Math.max(0, p - 1))}
          >
            <Text style={styles.arrowText}>{"<"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pageSizeRow}>
          {["5", "10", "20", "50", "All"].map((size) => {
            const numeric = size === "All" ? 9999 : parseInt(size, 10);
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
        <View style={styles.rightArrows}>
          <TouchableOpacity onPress={() => setPageIndex((p) => p + 1)}>
            <Text style={styles.arrowText}>{">"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPageIndex((p) => p + 2)}>
            <Text style={styles.arrowText}>{">>"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {filteredReports.map((r) => renderReport(r))}
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
        <TouchableOpacity style={styles.deleteButton} onPress={deleteSelected}>
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
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  filters: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  dateButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  dateButtonText: {
    color: "white",
  },
  picker: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  searchRow: {
    flexDirection: "row",
  },
  searchInput: {
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: "white",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  leftArrows: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  pageSizeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
  },
  sizeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  sizeButtonActive: {
    backgroundColor: "#007bff",
  },
  sizeText: {
    color: "white",
    fontWeight: "bold",
  },
  rightArrows: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  arrowText: {
    color: "white",
    fontSize: 18,
  },
  cardContainer: {
    position: "relative",
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 8,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#007bff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  header: {
    color: "white",
    fontWeight: "bold",
    marginRight: 4,
  },
  body: {
    color: "white",
    marginRight: 8,
  },
  divisionBody: {
    color: "white",
    fontSize: 12,
    marginLeft: 4,
  },
  type: {
    color: "white",
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginBottom: 4,
  },
  metaDate: {
    color: "white",
    fontSize: 12,
  },
  metaHours: {
    color: "white",
    fontSize: 12,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#dc3545",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    lineHeight: 24,
  },
});

export default Reports;
