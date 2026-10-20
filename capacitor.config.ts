const config: CapacitorConfig = {
  appId: 'com.rashaqa.app',
  appName: 'Rashaqa',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  android: {
    allowMixedContent: true,
  },
};
