import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  user: any;
  onLogout: () => void;
}

const LandingPage = ({ user, onLogout }: Props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome {user?.firstName || user?.name || user?.email}</Text>

      <TouchableOpacity style={styles.section}>
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text>Report Writing</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text>Schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text>Prayer Requests</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section}>
        <Text>Inbox</Text>
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