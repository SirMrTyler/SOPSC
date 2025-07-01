import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from '../../hooks/useAuth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App'; // Adjust the import path as necessary

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
  onLoginSuccess: (userData: any) => void;
  navigation: LoginScreenNavigationProp;
}

const Login: React.FC<LoginProps> = ({onLoginSuccess, navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, loading, signInEmail, signInGoogle } = useAuth();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    if (user) {
      onLoginSuccess(user);
    }
  }, [user]);

  const googleSignIn = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;
      const {name={firstName: userInfo.data.user.givenName, lastName: userInfo.data.user.familyName}, email, photo} = userInfo.data.user;
      if (!idToken) throw new Error('No ID token returned from Google Sign In');
      await signInGoogle(idToken, name, email);
      onLoginSuccess({ name, email, photo });
    } catch (error) {
        console.error(`Google Sign In Error: ${JSON.stringify(error)}`);
        alert(`Google Sign In Error: ${JSON.stringify(error)}`);
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
      <Button title="Sign In with Google" onPress={googleSignIn} />
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
