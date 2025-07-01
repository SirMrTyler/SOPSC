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
const HomeIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.HomeIcon })))
const ReportIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.DocumentTextIcon })))
const CalendarIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.CalendarIcon })))
const ChatBubbleLeftIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.ChatBubbleLeftIcon })))
const InboxIcon = lazy(() => import('react-native-heroicons/outline').then(m => ({ default: m.InboxIcon })))
interface Props {
  onLogout: () => void;
  user?: any;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Landing'>;
}

const LandingPage = ({ onLogout, user, navigation }: Props) => {
  const { signOut } = useAuth();
  const welcomeString = "Welcome to SOPSC";
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
      {/* <BeakerIcon size={24} color="blue" /> */}
      <Text style={styles.title}>{welcomeString + ' ' + displayName}</Text>

      <Suspense fallback={<Text>Loading...</Text>}>
        <TouchableOpacity style={styles.section} onPress={() => helpers.onHomePress(navigation)}>
          <HomeIcon size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={() => helpers.onReportPress(navigation)}>
          <ReportIcon size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={() => helpers.onSchedulePress(navigation)}>
          <CalendarIcon size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={() => helpers.onPublicPostPress(navigation)}>
          <ChatBubbleLeftIcon size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={() => helpers.onInboxPress(navigation)}>
          <InboxIcon size={24} color="black" />
        </TouchableOpacity>
      </Suspense>
      
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