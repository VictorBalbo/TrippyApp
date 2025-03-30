export interface FormatNumberOptions {
  delimiter?: string;
  precision?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
}

export const addPrefixAndSuffix = (
  value: string | number,
  options: { prefix?: string; suffix?: string }
) => {
  const { prefix = '', suffix = '' } = options;
  return `${prefix}${value}${suffix}`;
};

export const formatNumber = (input: number, options?: FormatNumberOptions) => {
  const {
    precision,
    separator = ',',
    delimiter = '.',
    prefix = '',
    suffix = '',
  } = options || {};

  const stringNumber = Math.abs(input).toFixed(precision);

  const parts = stringNumber.split('.');
  const buffer = [];

  let number = parts[0];
  while (number.length > 0) {
    buffer.unshift(number.slice(-3));
    number = number.slice(0, -3);
  }

  let formattedNumber = '';
  formattedNumber = buffer.join(delimiter);

  const decimals = parts[1];
  if (!!precision && decimals) {
    formattedNumber += separator + decimals;
  }

  return addPrefixAndSuffix(formattedNumber, { prefix, suffix });
};
