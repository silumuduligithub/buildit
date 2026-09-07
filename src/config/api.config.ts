import { Platform } from 'react-native';

/**
 * BuildKart Backend Base URL Configuration
 * Default port: 5001 (builditBackend)
 * - Android Emulator uses 10.0.2.2 to reach host machine
 * - iOS Simulator / Web uses localhost
 */
const getDevBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    // return 'http://10.0.2.2:5001/api/v1';
    return "https://builditbackend.onrender.com/api/v1";
  }
  // return 'http://localhost:5001/api/v1';
  return "https://builditbackend.onrender.com/api/v1";
};

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || getDevBaseUrl(),
  TIMEOUT_MS: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const API_BASE_URL = API_CONFIG.BASE_URL;
