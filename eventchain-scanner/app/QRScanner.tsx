import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  BarcodeScanningResult,
} from 'expo-camera';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './index';

export default function QRScanner() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [status, setStatus] = useState<'valid' | 'invalid' | null>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Avem nevoie de permisiunea ta pentru a folosi camera
        </Text>
        <Button title="Permite camera" onPress={requestPermission} />
      </View>
    );
  }

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('managerToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleQRCodeScanned = async (result: BarcodeScanningResult) => {
    if (!scannedData && result.data) {
      setScannedData(result.data);
      console.log('📦 Cod QR scanat:', result.data);

      try {
        const token = await SecureStore.getItemAsync('managerToken');
        console.log('🔑 Token manager:', token);

        if (!token) {
          Alert.alert('Eroare', 'Token lipsă');
          return;
        }

        const validateUrl = `https://eventchain-backend.fly.dev/api/manager-tickets/blockchain/${result.data}/validate`;
        console.log('🔍 Trimitem validare spre:', validateUrl);

        const validateRes = await fetch(validateUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('✅ Status răspuns validare:', validateRes.status);

        let validateData;
        try {
          validateData = await validateRes.json();
          console.log('📥 Date validare:', validateData);
        } catch {
          const raw = await validateRes.text();
          console.log('⚠️ Răspuns NE-JSON (raw text):', raw);
          setStatus('invalid');
          return;
        }

        if (!validateRes.ok || validateData.isValid !== true) {
          console.log('❌ Biletul este deja invalidat sau răspunsul este eronat');
          setStatus('invalid');
          return;
        }

        const invalidateUrl = `https://eventchain-backend.fly.dev/api/manager-tickets/blockchain/${result.data}/invalidate`;
        console.log('🧨 Trimitem invalidare spre:', invalidateUrl);

        const invalidateRes = await fetch(invalidateUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📤 Status răspuns invalidare:', invalidateRes.status);

        if (invalidateRes.ok) {
          console.log('✅ Bilet invalidat cu succes');
          setStatus('valid');
        } else {
          console.log('❌ Invalidarea a eșuat');
          setStatus('invalid');
        }
      } catch (err) {
        console.log('🔥 Eroare scanare:', err);
        setStatus('invalid');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const resetScan = () => {
    setScannedData(null);
    setStatus(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleQRCodeScanned}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Schimbă camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {status && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: status === 'valid' ? 'green' : 'red',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Text style={styles.resultText}>
            {status === 'valid'
              ? '✅ Bilet valid! Acces permis.'
              : '❌ Bilet invalidat deja!'}
          </Text>
          <TouchableOpacity onPress={resetScan} style={styles.resetButton}>
            <Text style={styles.resetText}>Scanează altul</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { textAlign: 'center', paddingBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 999,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
  },
  resetText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});
