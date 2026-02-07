import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goalapp.it.app',
  appName: 'Goal',
  webDir: 'build',
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "rgb(45, 45, 45)",
      iosSpinnerStyle: "small",
      androidSpinnerStyle: "small",
    
    },
    SocialLogin: {
      providers: {
        google: true,      // true = enabled (bundled), false = disabled (not bundled)
        facebook: false,   // Use false to reduce app size
        apple: false,      // Apple uses system APIs, no external deps
        twitter: false   // false = disabled (not bundled)
      }
    }
  }
};

export default config;
