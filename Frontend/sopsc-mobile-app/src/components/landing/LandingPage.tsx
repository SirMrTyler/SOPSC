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
import ScreenContainer from '../navigation/ScreenContainer';
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
  const reportsString = "Reports";
  const scheduleString = "Schedule";
  const publicPostString = "Prayer Requests";
  const inboxString = "Inbox";
  const adminString = "Admin Dashboard";

  // Handle users coming from different API shapes
  const displayName =
    user?.firstName ||
    user?.FirstName ||
    (typeof user?.name === 'object' ? user?.name?.firstName : user?.name) ||
    user?.Name ||
    user?.email ||
    user?.Email ||
    "";

  const content = user ? (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>{welcomeString + ' ' + displayName}</Text>
        <Suspense fallback={<Text>Loading...</Text>}>
          <View style={styles.grid}>

            { /* Home button, visible to all users */ }
            <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onHomePress(navigation)}>
              <HomeIcon style={styles.icon} size={32} color="white" />
              <Text style={styles.gridLabel}>{homeString}</Text>
            </TouchableOpacity>

            { /* Inbox button, visible to all users */ }
            <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onInboxPress(navigation)}>
              <InboxIcon style={styles.icon} size={32} color="white" />
              <Text style={styles.gridLabel}>{inboxString}</Text>
            </TouchableOpacity>

            { /* Schedule button, visible only to Developers, Admins, and Members */ }
            <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onSchedulePress(navigation)}>
              <CalendarIcon style={styles.icon} size={32} color="white" />
              <Text style={styles.gridLabel}>{scheduleString}</Text>
            </TouchableOpacity>

            { /* Report Writing button, visible only to Developers, Admins, and Members */ }
            <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onReportPress(navigation)}>
              <ReportIcon style={styles.icon} size={32} color="white" />
              <Text style={styles.gridLabel}>{reportsString}</Text>
            </TouchableOpacity>

            { /* Public Post button, visible to all users */ }
            <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onPublicPostPress(navigation)}>
              <ChatBubbleLeftIcon style={styles.icon} size={32} color="white" />
              <Text style={styles.gridLabel}>{publicPostString}</Text>
            </TouchableOpacity>
            
            {/* Admin Dashboard button, only visible if user is an admin */}
            <TouchableOpacity style={styles.gridItem} onPress={() => helpers.onAdminPress(navigation)}>
              <ReportIcon style={styles.icon} size={32} color="white" />
              <Text style={styles.gridLabel}>{adminString}</Text>
            </TouchableOpacity>
            
            {/* Placeholder for the last item to maintain grid structure */}
            <View style={[styles.gridItem, { opacity: 0 }]} />
            <TouchableOpacity
              style={styles.gridItem}
              onPress={async () => {
                await signOut();
                onLogout();
              }}>
              <LogoutIcon size={32} color="red" />
              <Text style={[styles.gridLabel, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
            {/* Placeholder for the last item to maintain grid structure */}
            <View style={[styles.gridItem, { opacity: 0 }]} />
          </View>
        </Suspense>
      </View>
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
    </View>
  );

  return <ScreenContainer>{content}</ScreenContainer>;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 16,
    width: '100%',
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
    width: '28%',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  gridLabel: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 15,
  },
  icon: {
    color: 'white',
    shadowColor: 'black',
  },
});

export default LandingPage;