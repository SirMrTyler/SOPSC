import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../navigation/ScreenContainer';

const Schedule: React.FC = () => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.text}>Schedule Screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});

export default Schedule;