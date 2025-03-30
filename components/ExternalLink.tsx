import { ExternalPathString, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';
import { TextType, ThemedText } from './ui/ThemedText';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  behavior?: 'inApp' | 'browser';
};

export function ExternalLink({
  href,
  behavior = 'inApp',
  children,
  ...rest
}: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as ExternalPathString}
      onPress={async (event) => {
        if (Platform.OS !== 'web' && behavior === "inApp") {
          console.log(href, href.startsWith('tel:'));
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    >
      <ThemedText type={TextType.Link}>{children}</ThemedText>
    </Link>
  );
}
