import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainStackNav from './src/Navigation/MainStackNav';
import { AppProvider } from './src/Context/AppContext';
import { TranslationProvider } from './src/Context/TranslationContext';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
       <TranslationProvider>
        <AppProvider>
          <MainStackNav />
        </AppProvider>
      </TranslationProvider> 
    </View>
  );
};

