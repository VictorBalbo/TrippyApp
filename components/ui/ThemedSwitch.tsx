import { useThemeColor } from '@/hooks/useTheme';
import { Switch, SwitchProps } from 'react-native';

export const ThemedSwitch = (props: SwitchProps) => {
  const inactiveColor = useThemeColor('backgroundAccent');
  const activeColor = useThemeColor('link');
  return (
    <Switch
      {...props}
      ios_backgroundColor={inactiveColor}
      trackColor={{ true: activeColor, false: inactiveColor }}
    />
  );
};
