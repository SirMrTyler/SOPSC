import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import ScreenContainer from "../Navigation/ScreenContainer";
import * as reportService from "./services/reportService";
import type { Report } from "../../types/report";
import { useAuth } from "../../hooks/useAuth";

const ReportDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
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

  const createdDate = new Date(report.dateCreated);
  const formattedDate = `${createdDate.toLocaleDateString()} ${createdDate
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()}`;

  const isAdmin = user?.Roles?.some(
    (r) => r.roleName === "Admin" || r.roleName === "Administrator"
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
    <ScreenContainer showBack title="Reports" showBottomBar={false}>
      <View style={styles.wrapper}>
        <Text style={styles.pageTitle}>Chaplain: {report.chaplain}</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowRight]}>
            <Text style={styles.header}>Hours Served:</Text>
            <Text style={styles.body}>{report.hoursOfService ?? "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.header}>Chaplain Division:</Text>
              <Text style={styles.body}>{report.chaplainDivision}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.dateText}>Created Date: {formattedDate}</Text>
          </View>
          <Text style={styles.header}>Narrative:</Text>
          <Text style={styles.body}>{report.narrative}</Text>
          {canModify && (
            <View style={styles.itemActions}>
              <Button
                title="Edit"
                onPress={() => navigation.navigate("Reports")}
              />
              <Button title="Delete" color="red" onPress={handleDelete} />
            </View>
          )}
        </View>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowCenter]}>
            <Text style={styles.header}>Call-Out Contacts</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.header}>Contact:</Text>
              <Text style={styles.body}>{report.contactName}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.header}>Phone:</Text>
              <Text style={styles.body}>{report.contactPhone ?? 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.header}>Agency:</Text>
            <Text style={styles.body}>
              {[
                report.primaryAgency,
                report.secondaryAgency,
                report.otherAgency,
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.header}>Service Type:</Text>
            <Text style={styles.body}>{report.typeOfService}</Text>
          </View>
          {report.contactEmail && (
            <View style={styles.row}>
              <Text style={styles.header}>Email:</Text>
              <Text style={styles.body}>{report.contactEmail}</Text>
            </View>
          )}
          <View style={[styles.row, styles.rowCenter]}>
            <Text style={styles.bodyCenter}>{report.addressDispatch}</Text>
          </View>
          {report.addressLine2Dispatch && (
            <View style={[styles.row, styles.rowCenter]}>
              <Text style={styles.bodyCenter}>
                {report.addressLine2Dispatch}
              </Text>
            </View>
          )}
          <View style={[styles.row, styles.rowCenter]}>
            <Text style={styles.bodyCenter}>
              {`${report.cityDispatch}${
                report.stateDispatch ? `, ${report.stateDispatch}` : ""
              }${
                report.postalCodeDispatch ? ` ${report.postalCodeDispatch}` : ""
              }`}
            </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.header}>Date of Dispatch:</Text>
              <Text style={styles.body}>{report.dateDispatch ?? "N/A"}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.header}>Commute Time:</Text>
              <Text style={styles.body}>{report.commuteTime ?? "N/A"}</Text>
            </View>
          </View>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 4,
  },
  body: {
    color: "white",
    fontSize: 14,
  },
  dateText: {
    color: "white",
    fontSize: 14,
    width: "100%",
    marginBottom: 8,
  },
  bodyCenter: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  loading: {
    color: "white",
  },
  pageTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "white",
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});

export default ReportDetails;
