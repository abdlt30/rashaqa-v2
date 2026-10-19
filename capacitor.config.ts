import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rashaqa.app',
  appName: 'Rashaqa',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true, // تفعيل الشبكة الأصلية (Native HTTP)
    },
  },
  // ✅ الحل السحري لمشاكل DNS في الأندرويد
  android: {
    allowMixedContent: true, // للسماح بالاتصالات المختلطة إذا لزم الأمر
  },
};

export default config;
