import { Alert, Platform } from 'react-native';

export interface ImagePickerResult {
  canceled: boolean;
  uri?: string;
  error?: string;
}

/**
 * Safely requests camera and launches camera capture
 */
export async function capturePhotoFromCamera(): Promise<ImagePickerResult> {
  try {
    let ImagePicker: any = null;
    try {
      ImagePicker = require('expo-image-picker');
    } catch (loadErr) {
      console.warn('[ImagePicker] Native module not present in APK:', loadErr);
    }

    if (ImagePicker && typeof ImagePicker.requestCameraPermissionsAsync === 'function') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take product photos. Please grant permission in device settings.'
        );
        return { canceled: true };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return { canceled: false, uri: result.assets[0].uri };
      }

      return { canceled: true };
    }

    // Fallback for emulator / dev before native recompilation
    return new Promise((resolve) => {
      Alert.alert(
        '📷 Camera Module (Dev Mode)',
        'Physical camera requires compiling the app with native build. Would you like to use a simulated product camera capture for now?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve({ canceled: true }),
          },
          {
            text: 'Use Camera Capture',
            onPress: () =>
              resolve({
                canceled: false,
                uri: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
              }),
          },
        ]
      );
    });
  } catch (error: any) {
    console.warn('[ImagePicker] Camera error:', error);
    return { canceled: true, error: error?.message };
  }
}

/**
 * Safely requests gallery permission and launches media library picker
 */
export async function pickPhotoFromGallery(): Promise<ImagePickerResult> {
  try {
    let ImagePicker: any = null;
    try {
      ImagePicker = require('expo-image-picker');
    } catch (loadErr) {
      console.warn('[ImagePicker] Native module not present in APK:', loadErr);
    }

    if (ImagePicker && typeof ImagePicker.requestMediaLibraryPermissionsAsync === 'function') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Gallery access is required to choose photos. Please grant permission in device settings.'
        );
        return { canceled: true };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return { canceled: false, uri: result.assets[0].uri };
      }

      return { canceled: true };
    }

    // Fallback for emulator / dev before native recompilation
    return new Promise((resolve) => {
      Alert.alert(
        '🖼️ Gallery Picker (Dev Mode)',
        'Device gallery requires compiling the app with native build. Would you like to select a sample product photo from gallery for now?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve({ canceled: true }),
          },
          {
            text: 'Select Gallery Photo',
            onPress: () =>
              resolve({
                canceled: false,
                uri: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=80',
              }),
          },
        ]
      );
    });
  } catch (error: any) {
    console.warn('[ImagePicker] Gallery error:', error);
    return { canceled: true, error: error?.message };
  }
}
