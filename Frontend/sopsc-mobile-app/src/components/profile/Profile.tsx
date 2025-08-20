import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import ScreenContainer from '../navigation/ScreenContainer';
import { useAuth } from '../../hooks/useAuth';
import { update as updateUser } from '../../services/userService.js';

const Profile: React.FC = () => {
  const { user, refresh } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyId, setAgencyId] = useState('');
  const [profilePicturePath, setProfilePicturePath] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  // There are agencies listed within SQL. Use those instead.
  const [agencies] = useState([
    { id: 1, name: 'Agency 1' },
    { id: 2, name: 'Agency 2' },
  ]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAgencyId(user.agencyId ? String(user.agencyId) : '');
      setProfilePicturePath(user.profilePicturePath || '');
    }
  }, [user]);

  const canEditAgency = user?.Roles?.some(
    (r) => r.roleName === 'Admin' || r.roleName === 'Developer',
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setProfilePicturePath(result.assets[0].uri);
    }
  };

  const onSave = async () => {
    if (!user) return;
    await updateUser({
      userId: user.userId,
      firstName,
      lastName,
      email,
      phone,
      profilePicturePath,
      roleId: user.Roles[0]?.roleId || 4,
      agencyId: agencyId ? Number(agencyId) : null,
    });
    await refresh();
    setIsEditing(false);
  };

  const onCancel = () => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAgencyId(user.agencyId ? String(user.agencyId) : '');
      setProfilePicturePath(user.profilePicturePath || '');
    }
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>User Profile</Text>
          {!isEditing && <Button title="Edit" onPress={() => setIsEditing(true)} />}
        </View>
        <TouchableOpacity onPress={isEditing ? pickImage : undefined} style={styles.imageWrapper}>
          {profilePicturePath ? (
            <Image source={{ uri: profilePicturePath }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.imagePlaceholder]} />
          )}
        </TouchableOpacity>
        <View>
          <Text style={styles.label}>First Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />
          ) : (
            <Text style={styles.value}>{firstName}</Text>
          )}
        </View>
        <View>
          <Text style={styles.label}>Last Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
          ) : (
            <Text style={styles.value}>{lastName}</Text>
          )}
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          ) : (
            <Text style={styles.value}>{email}</Text>
          )}
        </View>
        <View>
          <Text style={styles.label}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          ) : (
            <Text style={styles.value}>{phone}</Text>
          )}
        </View>
        <View>
          <Text style={styles.label}>Agency</Text>
          {isEditing ? (
            <Picker
              selectedValue={agencyId}
              onValueChange={(value) => setAgencyId(String(value))}
              enabled={canEditAgency}
              style={styles.picker}
            >
              {agencies.map((a) => (
                <Picker.Item key={a.id} label={a.name} value={String(a.id)} />
              ))}
            </Picker>
          ) : (
            <Text style={styles.value}>
              {agencies.find((a) => String(a.id) === agencyId)?.name || agencyId || ''}
            </Text>
          )}
        </View>
        {isEditing && (
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Save" onPress={onSave} />
          </View>
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 10,
    },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    marginBottom: 4,
  },
  value: {
    color: 'white',
    paddingVertical: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
});

export default Profile;