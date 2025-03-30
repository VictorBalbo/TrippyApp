import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { CurrencyInput, CurrencyInputProps } from './CurrencyInput';
import TextWithCursor from './TextWithCursor';
import { useState } from 'react';
import { useThemeProperty } from '@/hooks/useTheme';

export type FakeCurrencyInputProps = CurrencyInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  caretColor?: string;
  caretStyle?: StyleProp<TextStyle>;
};

/**
 * This component hides the real currency input and use a Text to imitate the input. So you won't get the flickering issue, but will lost selection functionality.
 * The cursor is not a real cursor, but a pipe character (|) and it'll be always at the end of the text.
 */
const FakeCurrencyInput = (props: FakeCurrencyInputProps) => {
  const {
    value,
    style,
    onChangeText,
    containerStyle,
    caretHidden,
    caretColor,
    caretStyle,
    selectionColor,
    onFocus,
    onBlur,
    ...rest
  }: FakeCurrencyInputProps = props;

  const [focused, setFocused] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');
  const placeholderStyle = formattedValue
    ? {}
    : { color: props.placeholderTextColor };

  return (
    <View style={[containerStyle, styles.inputContainer]}>
      <TextWithCursor
        style={[style, placeholderStyle]}
        cursorVisible={focused && !caretHidden}
        cursorProps={{
          style: [{ color: caretColor || selectionColor }, caretStyle],
        }}
      >
        {formattedValue ? formattedValue : props.placeholder}
      </TextWithCursor>
      <CurrencyInput
        value={value}
        onChangeText={(text) => {
          setFormattedValue(text);
          onChangeText && onChangeText(text);
        }}
        {...rest}
        placeholder=""
        caretHidden
        onFocus={(e) => {
          setFocused(true);
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur && onBlur(e);
        }}
        style={styles.inputHidden}
      />
    </View>
  );
};

const fontSize = useThemeProperty('textSize');

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
  },
  inputHidden: {
    color: 'transparent',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 5,
    bottom: 0,
  },
});

export default FakeCurrencyInput;
