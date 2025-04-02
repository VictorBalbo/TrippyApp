import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TripProvider } from '@/hooks/useTrip';
import Map from '@/components/Map';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Platform, StyleSheet } from 'react-native';
import { PlaceProvider } from '@/hooks/usePlaceContext';
import { ThemedView } from '@/components/ui/ThemedView';
import { useThemeColor, useThemeProperty } from '@/hooks/useTheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (Platform.OS === 'android') {
    const background = useThemeColor('background')
    NavigationBar.setBackgroundColorAsync(background);
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PlaceProvider>
      <TripProvider>
        <GestureHandlerRootView style={styles.container}>
          <Map />

          <BottomSheet
            snapPoints={['20%', '50%', '90%']}
            enableDynamicSizing={false}
            handleComponent={null}
            backgroundStyle={styles.viewContainer}
          >
            <ThemedView softBackground style={[styles.handleIndicator]} />
            <BottomSheetScrollView style={styles.viewContainer}>
              <Slot />
            </BottomSheetScrollView>
          </BottomSheet>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </TripProvider>
    </PlaceProvider>
  );
}

const smallSpacing = useThemeProperty('smallSpacing');
const borderRadius = useThemeProperty('borderRadius');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    borderTopLeftRadius: borderRadius * 3,
    borderTopRightRadius: borderRadius * 3,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    zIndex: 1,
    borderRadius: borderRadius,
    position: 'absolute',
    top: smallSpacing,
    alignSelf: 'center',
  },
});
