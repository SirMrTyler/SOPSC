import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { getApp } from '@react-native-firebase/app';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { register as registerUser } from './services/userService.js';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterProps {
  navigation: RegisterScreenNavigationProp;
  onRegisterSuccess: (userData: any) => void;
}

const Register: React.FC<RegisterProps> = ({ navigation, onRegisterSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);
    const { user, signInGoogle } = useAuth();

useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    if (user) {
      onRegisterSuccess(user);
    }
  }, [user]);

  const handleRegister = async () => {
    let firebaseUid = '';
    try {
      const fbAuth = getAuth(getApp());
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        fbAuth,
        email,
        password,
      );
      firebaseUid = firebaseUser.uid;
    } catch (firebaseError: any) {
      console.error(firebaseError);
      alert(firebaseError.message || 'Registration failed. Please try again.');
      return;
    }

    try {
      await registerUser({
        firstName,
        lastName,
        phone,
        email,
        password,
        passwordConfirm,
        firebaseUid,
      });
      alert('Registration successful! Please check your email to confirm.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };

  const googleSignUp = async () => {
    if (googleLoading) {
      return;
    }
    setGoogleLoading(true);
    try {
      await GoogleSignin.signOut(); // Ensure previous session is cleared
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo: any = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      const googleUser =
        userInfo.user || userInfo.data?.user || userInfo.data || {};

      const {
        givenName = '',
        familyName = '',
        email = '',
      } = googleUser;

      // Auto-fill the registration fields
      setFirstName(givenName);
      setLastName(familyName);
      setEmail(email);

      if (!idToken) throw new Error('No ID token returned from Google Sign Up');

      await signInGoogle(idToken);

    } catch (error: any) {
      if (error.code === statusCodes.IN_PROGRESS) {
        // ignore multiple sign-in attempts
        return;
      }
      console.error(`Google Sign Up Error: ${JSON.stringify(error)}`);
      alert(`Google Sign Up Error: ${JSON.stringify(error)}`);
    } finally {
      setGoogleLoading(false);
    }
  };

    return (
    <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={'#888'}
            value={firstName}
            onChangeText={setFirstName}
        />
        <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={'#888'}
            value={lastName}
            onChangeText={setLastName}
        />
        <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor={'#888'}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={'#888'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={'#888'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={'#888'}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
        />
        <Button title="Create Account" onPress={handleRegister} />
        <View style={{ height: 10 }} />
        <Button title="Register with Google" onPress={googleSignUp} disabled={googleLoading} />
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default Register;