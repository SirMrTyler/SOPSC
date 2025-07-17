import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuth } from '../../hooks/useAuth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App'; // Adjust the import path as necessary
import Constants from 'expo-constants';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
  onLoginSuccess: (userData: any) => void;
  navigation: LoginScreenNavigationProp;
}

const Login: React.FC<LoginProps> = ({onLoginSuccess, navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, loading, signInEmail, signInGoogle } = useAuth();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: '203699688611-5uibr1f84mjjdn3b80920r21p8vuohho.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    if (user) {
      onLoginSuccess(user);
    }
  }, [user]);

  const googleSignIn = async () => {
    if (googleLoading) {
      return;
    }
    setGoogleLoading(true);
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true});
      const userInfo: any = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      const googleUser = 
        userInfo.user || userInfo.data?.user || userInfo.data || {};

      const {
        givenName = '',
        familyName = '',
        email = '',
        photo = '',
      } = googleUser;

      const name = { firstName: givenName, lastName: familyName };

      if (!idToken) throw new Error('No ID token returned from Google Sign In');
      await signInGoogle(idToken, name, email);
      onLoginSuccess({ name, email, photo });
    } catch (error: any) {
        if (error.code === statusCodes.IN_PROGRESS) {
          return;
        }
        console.error(
          `\n
          ----------------------------------
          \nWebClientId: ${process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID}
          \nAndroid Package Name: ${Constants.expoConfig?.android?.package}
          \nGoogle Sign In Error Code: ${error.code}
          \nGoogle Sign In Error Message: ${JSON.stringify(error.message)}
          \nGoogle Sign In Error: ${JSON.stringify(error)}`
        );
        alert(`Google Sign In Error: ${JSON.stringify(error.message)}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOPSC Sign In</Text>
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
      <Button title="Sign In" onPress={() => signInEmail(email, password)} />
      <View style={{ height: 10 }} />
      <Button title="Sign In with Google" onPress={googleSignIn} disabled={googleLoading} />
      <View style={{ height: 10 }} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: 'white',
  },
});

export default Login;
