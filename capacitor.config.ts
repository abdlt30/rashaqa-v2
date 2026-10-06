import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rashaqa.app',
  appName: 'Rashaqa',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
