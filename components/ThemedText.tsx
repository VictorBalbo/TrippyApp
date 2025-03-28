import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useTheme';
import { Theme } from '@/constants/Theme';

export enum TextType {
  Default = 'default',
  Title = 'title',
  Bold = 'bold',
  Subtitle = 'subtitle',
  Link = 'link',
  Small = 'small',
}

export type ThemedTextProps = TextProps & {
  type?: TextType;
};

export function ThemedText({
  style,
  type = TextType.Default,
  ...rest
}: ThemedTextProps) {
  let color;
  let typeStyle;
  switch (type) {
    case 'default':
      color = useThemeColor('text');
      typeStyle = styles.default;
      break;
    case 'title':
      color = useThemeColor('text');
      typeStyle = styles.title;
      break;
    case 'bold':
      color = useThemeColor('text');
      typeStyle = styles.semiBold;
      break;
    case 'subtitle':
      color = useThemeColor('text');
      typeStyle = styles.subtitle;
      break;
    case 'link':
      color = useThemeColor('link');
      typeStyle = styles.link;
      break;
    case 'small':
      color = useThemeColor('helperText');
      typeStyle = styles.small;
      break;
  }
  return <Text style={[{ color }, typeStyle, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.5,
  },
  semiBold: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.5,
    fontWeight: '600',
  },
  title: {
    fontSize: Theme.base.textSize * 2,
    lineHeight: Theme.base.textSize * 2,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  link: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.5,
  },
  small: {
    fontSize: Theme.base.textSize * 0.75,
    lineHeight: Theme.base.textSize,
  },
});
