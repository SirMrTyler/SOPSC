import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        <Text style={styles.title}>User Profile</Text>
        <TouchableOpacity onPress={isEditing ? pickImage : undefined} style={styles.imageWrapper}>
          {profilePicturePath ? (
            <Image source={{ uri: profilePicturePath }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.imagePlaceholder]} />
          )}
          <View style={styles.pencilIcon}>
            <Ionicons name="pencil" size={20} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>First Name</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.sectionInput]}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />
          ) : (
            <Text style={styles.sectionValue}>{firstName}</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Last Name</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.sectionInput]}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
          ) : (
            <Text style={styles.sectionValue}>{lastName}</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Email</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.sectionInput]}
              placeholder="Email"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          ) : (
            <Text style={styles.sectionValue}>{email}</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.sectionInput]}
              placeholder="Phone"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          ) : (
            <Text style={styles.sectionValue}>{phone}</Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Agency</Text>
          {isEditing ? (
            <Picker
              selectedValue={agencyId}
              onValueChange={(value) => setAgencyId(String(value))}
              enabled={canEditAgency}
              style={[styles.picker, styles.sectionInput]}
            >
              {agencies.map((a) => (
                <Picker.Item key={a.id} label={a.name} value={String(a.id)} />
              ))}
            </Picker>
          ) : (
            <Text style={styles.sectionValue}>
              {agencies.find((a) => String(a.id) === agencyId)?.name || agencyId || ''}
            </Text>
          )}
        </View>
        
        {!isEditing && (
          <View style={styles.editButtonContainer}>
            <Button title="Edit" onPress={() => setIsEditing(true)} />
          </View>
        )}
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
  title: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
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
  pencilIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2477ff',
    borderRadius: 14,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  section: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionLabel: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 2,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionValue: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowRadius: 2,
    marginLeft: 20,
    marginTop: 1,
  },
  sectionInput: {
    marginLeft: 20,
    marginTop: 4,
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
  editButtonContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
});

export default Profile;