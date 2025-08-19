import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import ScreenContainer from '../navigation/ScreenContainer';
import { useAuth } from '../../hooks/useAuth';
import { update as updateUser } from '../../services/userService.js';

const Profile: React.FC = () => {
  const { user, refresh } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [agencyId, setAgencyId] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setAgencyId(user.agencyId ? String(user.agencyId) : '');
    }
  }, [user]);

  const onSave = async () => {
    if (!user) return;
    await updateUser({
      userId: user.userId,
      firstName,
      lastName,
      email,
      profilePicturePath: user.profilePicturePath,
      roleId: user.Roles[0]?.roleId || 4,
      agencyId: agencyId ? Number(agencyId) : null,
    });
    await refresh();
  };

  if (!user) return null;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Agency Id"
          placeholderTextColor="#888"
          value={agencyId}
          onChangeText={setAgencyId}
          keyboardType="numeric"
        />
        <Button title="Save" onPress={onSave} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
  },
});

export default Profile;