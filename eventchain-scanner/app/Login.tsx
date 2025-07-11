import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Login({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const resetAndCheckToken = async () => {
      await SecureStore.deleteItemAsync('managerToken');
      const token = await SecureStore.getItemAsync('managerToken');
      console.log('🔄 Token șters/verificat:', token);
      if (token) {
        navigation.replace('Scanner');
      }
    };
    resetAndCheckToken();
  }, [navigation]);

  const handleLogin = async () => {
    console.log('➡️ Trimitem request cu:', { username, password });

    try {
      const res = await fetch('https://eventchain-backend.fly.dev/api/manager/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('📡 Status cod răspuns:', res.status);

      const text = await res.text();
      console.log('📨 Răspuns brut:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.log('⚠️ Eroare la parsarea JSON:', jsonErr);
        throw new Error('Răspuns invalid de la server');
      }

      if (res.ok) {
        await SecureStore.setItemAsync('managerToken', data.token);
        Alert.alert('Succes', 'Autentificare reușită');
        navigation.replace('Scanner');
      } else {
        Alert.alert('Eroare', data.error || 'Autentificare eșuată');
      }
    } catch (err) {
      console.log('EROARE LOGIN', err);
      Alert.alert('Eroare', 'Serverul nu a putut fi contactat');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Parolă"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Autentificare</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});
