import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  user: any;
  onLogout: () => void;
}

const LandingPage = ({ user, onLogout }: Props) => {
  const welcomeString = "Welcome to SOPSC";
  const homeString = "Home";
  const reportsString = "Report Writing";
  const scheduleString = "Schedule";
  const publicPostString = "Prayer Requests";
  const inboxString = "Inbox";
  console.log("User in LandingPage:", user);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{welcomeString + ' ' + (user?.firstName || user?.name || user?.email)}</Text>

      <TouchableOpacity style={styles.section}>
        <Text>{homeString}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text>{reportsString}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text>{scheduleString}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text>{publicPostString}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text>{inboxString}</Text>
      </TouchableOpacity>

      <Button title="Log Out" onPress={onLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    width: '100%',
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
    alignItems: 'center',
  },
});

export default LandingPage;