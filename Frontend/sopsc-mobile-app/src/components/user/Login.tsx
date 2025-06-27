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
      navigation.reset({
        index: 0,
        routes: [{ name: 'Landing', params: { user } }],
      });
    }
  }, [user]);

  const googleSignIn = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;
      const {name=`${userInfo.data.user.givenName} ${userInfo.data.user.familyName}`, email, photo} = userInfo.data.user;
      if (!idToken) throw new Error('No ID token returned from Google Sign In');
      await signInGoogle(idToken, name, email);
      onLoginSuccess({ name, email, photo });
    } catch (error) {
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
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={() => signInEmail(email, password)} />
      <View style={{ height: 10 }} />
      <Button title="Sign In with Google" onPress={googleSignIn} />
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

export default Login;
