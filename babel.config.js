module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./app'],
        alias: {
          pages: './app/pages',
          routes: './app/routes',
          store: './app/store',
          sagas: './app/store/sagas',
          selectors: './app/store/selectors',
          slices: './app/store/slices',
          hooks: './app/hooks',
          client: './app/client',
          components: './app/components',
        },
      },
    ],
  ],
}

