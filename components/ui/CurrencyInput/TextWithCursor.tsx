import * as React from 'react';
import { StyleSheet, TextProps, View } from 'react-native';

import useBlink from './useBlink';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useThemeColor, getThemeProperty } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';

export interface TextWithCursorProps extends TextProps {
  children?: React.ReactNode;

  /**
   * Show or hides the cursor. Defaults to false
   */
  cursorVisible?: boolean;

  /**
   * Props for the cursor. Use this to set a custom `style` prop.
   */
  cursorProps?: TextProps;
}

const TextWithCursor = (textWithCursorProps: TextWithCursorProps) => {
  const { children, cursorVisible, style, cursorProps, ...rest } =
    textWithCursorProps;

  const blinkVisible = useBlink();
  const [isTyping, setIsTyping] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const textSize = getThemeProperty('textSize');
  const color = useThemeColor('link');

  const cursorVisibility = useMemo(() => {
    return cursorVisible && (blinkVisible || isTyping);
  }, [blinkVisible, cursorVisible, isTyping]);

  useEffect(() => {
    setIsTyping(true);
    timeout.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);

    return () => {
      timeout.current && clearTimeout(timeout.current);
    };
  }, [children]);

  return (
    <View style={styles.textWithCursorView}>
      <ThemedText {...rest}>{children}</ThemedText>
      <ThemedText
        {...cursorProps}
        style={[
          { fontSize: textSize * 1.25, color },
          cursorProps?.style,
          !cursorVisibility ? styles.cursorHidden : undefined,
        ]}
      >
        |
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  textWithCursorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cursorHidden: {
    color: 'transparent',
  },
});

export default TextWithCursor;
