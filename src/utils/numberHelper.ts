import { MAX_DIGITS } from '@/constants/common';

type TOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export const formatNumber = (num: number, options?: TOptions) => {
  const maximumFractionDigits =
    Math.abs(num) < 0.01 && num !== 0
      ? MAX_DIGITS
      : options?.maximumFractionDigits;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: maximumFractionDigits,
  });
};
