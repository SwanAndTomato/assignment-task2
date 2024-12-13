import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'devfinder',
    slug: 'devfinder',
    owner: 'swanandtomato',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'cover',
        backgroundColor: '#031A62',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.bvc-mobile-app-swanandtomato.devfinder",
      },
      android: {
        package: "com.bvc-mobile-app-swanandtomato.devfinder",
      },
    web: {
        favicon: './assets/favicon.png',
    },
    plugins: [
        [
            'expo-image-picker',
            {
                photosPermission: 'The app accesses your photos to let you add them to events.',
                cameraPermission: 'The app accesses your camera to let you add pictures to events.',
            },
        ],
    ],
    extra: {
        eas: {
            projectId: 'bfa61103-0c53-4ffa-999a-260d7c7a3c05',
        },
        IMGBB_API_KEY: process.env.IMGBB_API_KEY,
    },
});
