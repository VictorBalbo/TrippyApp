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

export const getDisplayDurationFromSeconds = (distance: number) => {
  const hours = Math.floor(distance / 3600)
  const minutes = Math.floor((distance % 3600) / 60)

  if (distance < 60) {
    return `${Math.round(distance)} seg`
  }
  if (!hours) {
    return `${minutes} min`
  }
  return `${hours}hr ${minutes} min`
}
