import { TextInputProps } from 'react-native';
import { formatNumber } from '@/utils/numberFormat';
import { useCallback, useEffect, useMemo } from 'react';
import { ThemedInput } from '../ThemedInput';

export type CurrencyInputProps = Omit<TextInputProps, 'value'> & {
  value?: number;
  delimiter?: string;
  maxValue?: number;
  minValue?: number;
  onChangeValue?(value?: number): void;
  precision?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  unit?: string;
};

export const CurrencyInput = (props: CurrencyInputProps) => {
  const {
    value,
    onChangeText,
    onChangeValue,
    separator,
    delimiter,
    prefix = '',
    suffix = '',
    precision = 2,
    maxValue,
    minValue,
    ...rest
  } = props;

  const formattedValue = useMemo(() => {
    if (!!value || value === 0 || value === -0) {
      return formatNumber(value, {
        separator,
        prefix,
        suffix,
        precision,
        delimiter,
      });
    } else {
      return '';
    }
  }, [value, separator, prefix, suffix, precision, delimiter]);

  useEffect(() => {
    onChangeText && onChangeText(formattedValue);
  }, [formattedValue]);

  const handleChangeText = useCallback(
    (text: string) => {
      let textWithoutPrefix = text;
      if (prefix) {
        textWithoutPrefix = text.replace(prefix, '');
        if (textWithoutPrefix === text) {
          textWithoutPrefix = text.replace(prefix.slice(0, -1), '');
        }
      }
      let textWithoutPrefixAndSuffix = textWithoutPrefix;
      if (suffix) {
        textWithoutPrefixAndSuffix = textWithoutPrefix.replace(suffix, '');
        if (textWithoutPrefixAndSuffix === textWithoutPrefix) {
          textWithoutPrefixAndSuffix = textWithoutPrefix.replace(
            suffix.slice(1),
            ''
          );
        }
      }

      const textNumericValue = textWithoutPrefixAndSuffix.replace(/\D+/g, '');
      const numberValue = Number(textNumericValue);
      const zerosOnValue = textNumericValue.replace(/[^0]/g, '').length;

      let newValue: number | undefined;

      if (!numberValue && zerosOnValue === precision) {
        // Allow to clean the value instead of beign 0
        newValue = undefined;
      } else {
        newValue = numberValue / 10 ** precision;
      }

      if (newValue && maxValue && newValue > maxValue) {
        return;
      } else if (newValue && minValue && newValue < minValue) {
        return;
      }
      onChangeValue && onChangeValue(newValue);
    },
    [
      prefix,
      suffix,
      precision,
      maxValue,
      minValue,
      onChangeValue,
    ]
  );

  const nextProps: TextInputProps = useMemo(
    () => ({
      keyboardType: 'numeric' as const,
      ...rest,
      value: formattedValue,
      onChangeText: handleChangeText,
    }),
    [handleChangeText, rest, formattedValue]
  );

  return <ThemedInput {...nextProps} />;
};
