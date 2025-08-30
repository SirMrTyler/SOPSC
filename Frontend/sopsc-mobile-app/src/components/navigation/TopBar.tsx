import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import {
  BellIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  ChevronLeftIcon,
} from 'react-native-heroicons/outline';

interface Props {
  showBack?: boolean;
  title?: string;
  hasUnreadMessages?: boolean;
  rightComponent?: React.ReactNode;
}

const TopBar: React.FC<Props> = ({
  showBack,
  title,
  hasUnreadMessages,
  rightComponent,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {showBack ? (
        <View style={styles.leftRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
          <Text style={styles.title}>SOPSC</Text>
        </TouchableOpacity>
      )}
      <View style={styles.rightRow}>
        {rightComponent ? (
          rightComponent
        ) : (
          !showBack && (
            <>
              <TouchableOpacity style={styles.icon}>
                <BellIcon color="white" size={22} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => navigation.navigate('Messages')}
              >
                {hasUnreadMessages ? (
                  <EnvelopeIcon color="white" size={22} />
                ) : (
                  <EnvelopeOpenIcon color="white" size={22} />
                )}
              </TouchableOpacity>
            </>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#0a2a63',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    padding: 4,
  },
});

export default TopBar;