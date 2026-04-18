/**
 * @format
 */

/* eslint-env jest */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: (_config, reducers) => reducers,
    persistStore: () => ({
      persist: () => {},
      purge: () => {},
      flush: () => {},
      pause: () => {},
      addListener: () => () => {},
    }),
  };
});

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: (props) => props.children,
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
}));

jest.mock('./src/navigation/RootNavigator', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  function MockNavigator() {
    return React.createElement(
      View,
      null,
      React.createElement(Text, null, 'EducaseAssignment'),
    );
  }
  return { __esModule: true, default: MockNavigator };
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        info: {
          count: 0,
          pages: 0,
          next: null,
          prev: null,
        },
        results: [],
      }),
  }),
);
