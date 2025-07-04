import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from '../../hooks/useAuth';
import { register as registerUser } from '../../services/userService.js';
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
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const { user } = useAuth();

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
    try {
      await registerUser({firstName, lastName, email, password, passwordConfirm});
      alert('Registration successful! Please check your email to confirm.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };

  const googleSignUp = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();

      const {
        givenName = '',
        familyName = '',
        email = '',
      } = (userInfo.data || userInfo.data?.user || {}) as any;

      // Auto-fill the registration fields
      setFirstName(givenName);
      setLastName(familyName);
      setEmail(email);

    } catch (error) {
      console.error(`Google Sign Up Error: ${JSON.stringify(error)}`);
      alert(`Google Sign Up Error: ${JSON.stringify(error)}`);
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
        <Button title="Register with Google" onPress={googleSignUp} />
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