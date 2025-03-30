import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor, useThemeProperty } from '@/hooks/useTheme';
import { ThemedView } from './ThemedView';
import { BottomPicker } from './BottomPicker';
import FakeCurrencyInput from './CurrencyInput/FakeCurrencyInput';

interface InputMoneyProps {
  model: { value?: number; currency?: string };
  onValueChange: ({
    value,
    currency,
  }: {
    value?: number;
    currency?: string;
  }) => void;
  placeholder?: string;
  style: StyleProp<ViewStyle>;
}

const decimalSeparator = new Intl.NumberFormat().format(1.1).includes(',')
  ? ','
  : '.';
const thousandsSeparator = new Intl.NumberFormat().format(1.1).includes(',')
  ? '.'
  : ',';

export const InputMoney = ({
  model,
  onValueChange,
  style,
}: InputMoneyProps) => {
  const backgroundColor = useThemeColor('backgroundAccent');
  const color = useThemeColor('text');
  const placeholderColor = useThemeColor('inactiveTint');
  const divider = useThemeColor('border');

  const currencies = [
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'GBP (£)', value: 'GBP' },
    { label: 'BRL (R$)', value: 'BRL' },
  ];
  model.currency ??= 'BRL';

  return (
    <ThemedView style={[styles.inputMoneyContainer, style]}>
      <BottomPicker
        options={currencies}
        onValueChange={(currency) =>
          onValueChange({ value: model.value, currency })
        }
        selectedValue={model.currency}
        buttonStyle={[styles.currencyButton]}
      />
      <FakeCurrencyInput
        value={model.value}
        placeholder="0.00"
        onChangeValue={(val) =>
          onValueChange({ value: val, currency: model.currency })
        }
        maxValue={1000000}
        delimiter={thousandsSeparator}
        separator={decimalSeparator}
        keyboardType="numeric"
        autoComplete="off"
        autoCorrect={false}
        placeholderTextColor={placeholderColor}
        containerStyle={[
          styles.fakeInputContainer,
          { borderLeftColor: divider, backgroundColor },
        ]}
        style={[styles.fakeInput, { color }]}
      />
    </ThemedView>
  );
};

const fontSize = useThemeProperty('textSize');
const borderRadius = useThemeProperty('borderRadius');
const smallSpacing = useThemeProperty('smallSpacing');

const styles = StyleSheet.create({
  inputMoneyContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  currencyButton: {
    fontWeight: 300,
    borderRadius: 0,
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },
  input: {
    width: '100%',
    flex: 1,
    fontSize,
    lineHeight: fontSize,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    paddingLeft: smallSpacing,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    borderLeftWidth: 1,
    color: 'red',
  },
  fakeInputContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    justifyContent: 'center',
  },
  fakeInput: {
    fontSize: fontSize,
    lineHeight: fontSize * 1.25,
  },
});
