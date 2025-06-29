import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import * as helpers from './landingPageHelpers';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

interface Props {
  onLogout: () => void;
  user?: any;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Landing'>;
}

const LandingPage = ({ onLogout, user, navigation }: Props) => {
  const { signOut } = useAuth();
  const welcomeString = "Welcome to SOPSC";
  const homeString = "Home";
  const reportsString = "Report Writing";
  const scheduleString = "Schedule";
  const publicPostString = "Prayer Requests";
  const inboxString = "Inbox";
  console.log("[LandingPage] user:", user);

  // Handle users coming from different API shapes
  const displayName =
    user?.firstName ||
    user?.FirstName ||
    user?.name ||
    user?.Name ||
    user?.email ||
    user?.Email ||
    "";

  return user ? (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{welcomeString + ' ' + displayName}</Text>

      <TouchableOpacity style={styles.section} onPress={() =>helpers.onHomePress(navigation)}>
        <Text>{homeString}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => helpers.onReportPress(navigation)}>
        <Text>{reportsString}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => helpers.onSchedulePress(navigation)}>
        <Text>{scheduleString}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => helpers.onPublicPostPress(navigation)}>
        <Text>{publicPostString}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.section} onPress={() => helpers.onInboxPress(navigation)}>
        <Text>{inboxString}</Text>
      </TouchableOpacity>

      <Button
        title="Log Out"
        onPress={() => {
          signOut();
          onLogout();
        }}
      />
    </ScrollView>
  ) : (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
      </View>
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