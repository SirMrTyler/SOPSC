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

  const config = Constants.expoConfig?.extra || {};

  useEffect(() => {
    const webId = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    GoogleSignin.configure({
      webClientId: webId,
      iosClientId: config.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    if (user) {
      onLoginSuccess(user);
    }
  }, [user]);

  const withTimeout = <T,>(p: Promise<T>, ms: number, label: string) =>
  Promise.race([
    p,
    new Promise<never>((_, rej) => setTimeout(() => rej(new Error(`${label} timed out`)), ms)),
  ]);

const googleSignIn = async () => {
  if (googleLoading) return;
  setGoogleLoading(true);
  try {
    console.log('[1] hasPlayServices...');
    await withTimeout(
      GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }),
      8000,
      'hasPlayServices'
    );
    console.log('[2] signIn()...');
    const userInfo: any = await withTimeout(GoogleSignin.signIn(), 20000, 'signIn');

    console.log('[3] getTokens()...');
    const { idToken } = await withTimeout<{ idToken: string | null }>(
      GoogleSignin.getTokens(),
      8000,
      'getTokens'
    );
    if (!idToken) throw new Error('No idToken');

    const { givenName = '', familyName = '', email = '', photo = '' } =
      userInfo?.user ?? userInfo?.data?.user ?? {};

    // ===== DIAGNOSTIC SWITCH =====
    // Temporarily comment out the next 2 lines to see if the hang is your backend call.
    console.log('[4] signInGoogle() to API...');
    await withTimeout(signInGoogle(idToken), 15000, 'signInGoogle(backend)');

    console.log('[5] onLoginSuccess()');
    onLoginSuccess({ firstName: givenName, lastName: familyName, email, photo });
  } catch (e: any) {
    console.log('Google Sign In Error:', JSON.stringify(e, Object.getOwnPropertyNames(e)));
    alert(`Google Sign In Error: ${e.code ?? ''} ${e.message ?? ''}`);
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
