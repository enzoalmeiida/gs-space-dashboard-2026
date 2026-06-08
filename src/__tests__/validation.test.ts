import { isValidCargoCode } from '@/utils/validation';

describe('validation util', () => {
  test('valid codes', () => {
    expect(isValidCargoCode('ORBIT-1')).toBe(true);
    expect(isValidCargoCode('ABC12')).toBe(true);
  });

  test('invalid codes', () => {
    expect(isValidCargoCode('')).toBe(false);
    expect(isValidCargoCode('ab')).toBe(false);
    expect(isValidCargoCode('123')).toBe(false);
    expect(isValidCargoCode('A B C')).toBe(false);
  });
});
