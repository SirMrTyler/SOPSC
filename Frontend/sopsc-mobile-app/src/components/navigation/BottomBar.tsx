import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from 'react-native-heroicons/outline';
import { useAuth } from '../../hooks/useAuth';

const BottomBar: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const displayLetter =
    user?.name?.[0] ||
    user?.email?.[0] ||
    'U';
  const homeScreenString = 'Home';
  const postScreenString = 'Prayer';
  const reportScreenString = 'Reports';
  const scheduleScreenString = 'Schedule';
  const profileScreenString = 'Profile';

  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Landing')}>
      <View style={styles.centered}>
        <HomeIcon color="white" size={24} />
        <Text style={styles.label}>Home</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Posts')}>
      <View style={styles.centered}>
        <UserGroupIcon color="white" size={24} />
        <Text style={styles.label}>Prayer</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Reports')}>
      <View style={styles.centered}>
        <DocumentTextIcon color="white" size={24} />
        <Text style={styles.label}>Reports</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Schedule')}>
      <View style={styles.centered}>
        <CalendarDaysIcon color="white" size={24} />
        <Text style={styles.label}>Schedule</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Profile')}>
      <View style={styles.centered}>
        {user?.profilePicturePath ? (
          <Image source={{ uri: user.profilePicturePath }} style={styles.avatar} />
        ) : (
          <View style={styles.letterCircle}>
            <Text style={styles.letter}>{displayLetter}</Text>
          </View>
        )}
        <Text style={styles.label}>Profile</Text>
      </View>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#0a2a63',
  },
  iconButton: {
    padding: 6,
  },
  label: {
    fontSize: 9,
    color: 'white',
    marginTop: 2,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  letterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontWeight: 'bold',
    color: '#0a2a63',
  },
});

export default BottomBar;