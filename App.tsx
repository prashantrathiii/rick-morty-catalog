/**
 * Educase assignment — Rick and Morty character browser.
 *
 * @format
 */

import {
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { useCallback } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RootNavigator from './src/navigation/RootNavigator';
import { useAppLifecycle } from './src/hooks/useAppLifecycle';
import { persistor, store } from './src/store';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#ffffff',
    border: '#e5e7eb',
    primary: '#2563eb',
    text: '#111827',
  },
};

function AppShell() {
  useAppLifecycle();

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
      />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

const loading = (
  <View style={styles.boot}>
    <ActivityIndicator size="large" />
  </View>
);

function App() {
  const onBeforeLift = useCallback(() => {
    if (__DEV__) {
      console.log('[Persist] Rehydration complete');
    }
  }, []);

  return (
    <SafeAreaProvider style={styles.root}>
      <Provider store={store}>
        <PersistGate loading={loading} persistor={persistor} onBeforeLift={onBeforeLift}>
          <AppShell />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
