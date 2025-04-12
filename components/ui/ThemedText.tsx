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

export const ThemedText = ({
  style,
  type = TextType.Default,
  ...rest
}: ThemedTextProps) => {
  let color;
  let typeStyle;
  const defaultTextColor = useThemeColor('text');
  const defaultLinkColor = useThemeColor('link');
  const defaultHelperTextColor = useThemeColor('helperText');
  switch (type) {
    case 'default':
      color = defaultTextColor;
      typeStyle = styles.default;
      break;
    case 'title':
      color = defaultTextColor;
      typeStyle = styles.title;
      break;
    case 'bold':
      color = defaultTextColor;
      typeStyle = styles.semiBold;
      break;
    case 'subtitle':
      color = defaultTextColor;
      typeStyle = styles.subtitle;
      break;
    case 'link':
      color = defaultLinkColor;
      typeStyle = styles.link;
      break;
    case 'small':
      color = defaultHelperTextColor;
      typeStyle = styles.small;
      break;
  }
  return <Text style={[{ color }, typeStyle, style]} {...rest} />;
};

const styles = StyleSheet.create({
  default: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.25,
  },
  semiBold: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.25,
    fontWeight: '600',
  },
  title: {
    fontSize: Theme.base.textSize * 2,
    lineHeight: Theme.base.textSize * 2.5,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: Theme.base.textSize * 1.5,
    lineHeight: Theme.base.textSize * 1.875,
    fontWeight: 'bold',
  },
  link: {
    fontSize: Theme.base.textSize,
    lineHeight: Theme.base.textSize * 1.25,
  },
  small: {
    fontSize: Theme.base.textSize * 0.75,
    lineHeight: Theme.base.textSize * 0.875,
  },
});
