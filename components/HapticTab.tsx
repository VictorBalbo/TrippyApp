import { HapticService } from '@/services';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        HapticService.hapticImpact()
        props.onPressIn?.(ev);
      }}
    />
  );
}
