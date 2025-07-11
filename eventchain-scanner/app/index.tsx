import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import QRScanner from './QRScanner';

// Exportăm tipul pentru a putea fi folosit în QRScanner.tsx
export type RootStackParamList = {
  Login: undefined;
  Scanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Scanner" component={QRScanner} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
