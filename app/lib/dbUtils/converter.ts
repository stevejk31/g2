/**
 * @fileoverview
 * Misc converted methods.
 */

export const isString = (unknown: unknown): unknown is string => !!unknown && typeof unknown === 'string';

export const convertStringToNumber = (
  value: unknown,
  defaultValue: number,
  isInt: boolean = false,
) => {
  if (!value || typeof value !== 'string') {
    return defaultValue;
  }
  try {
    if (isInt) {
      return parseInt(value.replace(/\[^0-9.]/g, ''), 10);
    }
    return parseFloat(value.replace(/\[^0-9.]/g, ''));
  } catch {
    return defaultValue;
  }
};

export const getCurrentDate = () => new Date().toISOString().split('T')[0];
