// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  plugins: ['react', 'react-native'],
  rules: {
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-color-literals': 2,
    'react-native/no-raw-text': [
      'error',
      {
        skip: ['ThemedText', 'ExternalLink'],
      },
    ],
    'react-native/no-single-element-style-arrays': 2,
  },
};
