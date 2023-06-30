import {MyAwesomeError, resolveValue, throwCustomError, throwError} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 5;
    const result = await resolveValue(value);

    expect(result).toBe(value);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const message = 'error message';
    expect(() => throwError(message)).toThrow(message);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrowError(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    // expect(Promise.reject(() => rejectCustomError())).not.toThrowError();
  });
});
