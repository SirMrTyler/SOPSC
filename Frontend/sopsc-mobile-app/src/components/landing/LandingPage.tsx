// Library imports
import React, { lazy, Suspense } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { BeakerIcon } from '@heroicons/react/solid';
// import * as LandingPageIcons from '../../../assets/icons/LandingPageIcons'

// Custom code imports
import { useAuth } from '../../hooks/useAuth';
import * as helpers from './landingPageHelpers';
import type { RootStackParamList } from '../../../App';

// Icon imports lazy loaded to reduce initial bundle size
const HomeIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.HomeIcon })));
const ReportIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.DocumentTextIcon })));
const CalendarIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.CalendarIcon })));
const ChatBubbleLeftIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.ChatBubbleLeftIcon })));
const InboxIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.InboxIcon })));
const LogoutIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.ArrowRightEndOnRectangleIcon })));

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
  const adminString = "Admin Dashboard";
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
      <Suspense fallback={<Text>Loading...</Text>}>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onHomePress(navigation)}>
            <HomeIcon style={styles.icon} size={32} color="white" />
            <Text style={styles.gridLabel}>{homeString}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onReportPress(navigation)}>
            <ReportIcon style={styles.icon} size={32} color="white" />
            <Text style={styles.gridLabel}>{reportsString}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onSchedulePress(navigation)}>
            <CalendarIcon style={styles.icon} size={32} color="white" />
            <Text style={styles.gridLabel}>{scheduleString}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onPublicPostPress(navigation)}>
            <ChatBubbleLeftIcon style={styles.icon} size={32} color="white" />
            <Text style={styles.gridLabel}>{publicPostString}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onInboxPress(navigation)}>
            <InboxIcon style={styles.icon} size={32} color="white" />
            <Text style={styles.gridLabel}>{inboxString}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onAdminPress(navigation)}>
            <ReportIcon style={styles.icon} size={32} color="white" />
            <Text style={styles.gridLabel}>{adminString}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={async () => { 
              await signOut(); 
              onLogout(); 
            }}>
            <LogoutIcon size={32} color="red" />
            <Text style={[styles.gridLabel, { color: 'red' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Suspense>
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
    color: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 24,
    columnGap: 8,
    width: '100%',
    marginTop: 30,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    marginVertical: 15,
  },
  gridLabel: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  icon: {
    color: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  }
});

export default LandingPage;