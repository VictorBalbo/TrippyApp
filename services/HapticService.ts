import * as Haptics from 'expo-haptics';

export class HapticService {
  static hapticImpact = (
    style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light
  ) => {
    if (style === Haptics.ImpactFeedbackStyle.Light) {
      // Light Haptics only on iOS
      if (process.env.EXPO_OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      Haptics.impactAsync(style);
    }
  };
}
