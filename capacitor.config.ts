import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deepsleep.ai',
  appName: 'DeepSleep AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
