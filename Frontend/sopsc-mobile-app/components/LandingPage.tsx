import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

interface Props {
  user: any;
  onLogout: () => void;
}

const LandingPage = ({ user, onLogout }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user?.firstName || user?.name || user?.email}</Text>
      <Button title="Log Out" onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LandingPage;