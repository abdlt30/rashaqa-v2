import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rashaqa.app', // تأكد من معرف التطبيق الخاص بك
  appName: 'Rashaqa',
  webDir: 'dist',
  server: {
    androidScheme: 'https' // ✅ مهم جداً
  },
  // ✅ تفعيل الشبكة الأصلية
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
