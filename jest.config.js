module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|react-redux|@reduxjs/toolkit|redux|immer|@react-navigation/.*|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|redux-persist|@react-native-async-storage/async-storage)',
  ],
};
