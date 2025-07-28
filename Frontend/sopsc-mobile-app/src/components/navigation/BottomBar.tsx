import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Landing')}
      >
        <HomeIcon color="white" size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Posts')}
      >
        <ChatBubbleLeftRightIcon color="white" size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Reports')}
      >
        <DocumentTextIcon color="white" size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Schedule')}
      >
        <CalendarDaysIcon color="white" size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Profile')}
      >
        {user?.profilePicturePath ? (
          <Image source={{ uri: user.profilePicturePath }} style={styles.avatar} />
        ) : (
          <View style={styles.letterCircle}>
            <Text style={styles.letter}>{displayLetter}</Text>
          </View>
        )}
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