import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getApiBaseUrl(): string {
  // Use environment variable if provided
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  // For web platform, use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }

  // For mobile platforms, extract IP from Expo's hostUri
  // hostUri format: "192.168.1.100:8081" or "localhost:8081"
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  
  if (hostUri) {
    // Extract IP address (everything before the colon)
    const ip = hostUri.split(':')[0];
    
    // If it's localhost, try to get the actual IP from the development server
    if (ip === 'localhost' || ip === '127.0.0.1') {
      // Fallback: try to get IP from the debugger host
      // In development, Expo provides the actual network IP
      const debuggerHost = Constants.manifest?.debuggerHost;
      if (debuggerHost && debuggerHost !== 'localhost:8081') {
        const debuggerIp = debuggerHost.split(':')[0];
        return `http://${debuggerIp}:3000`;
      }
      // If still localhost, return localhost (for simulator/emulator)
      return 'http://localhost:3000';
    }
    
    // Use the extracted IP with port 3000
    return `http://${ip}:3000`;
  }

  // Fallback to localhost if hostUri is not available
  return 'http://localhost:3000';
}

export const API_BASE_URL = getApiBaseUrl();

