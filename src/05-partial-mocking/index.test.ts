// Uncomment the code below and write your tests
import {mockOne, mockTwo, mockThree, unmockedFunction} from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(() => 1),
    mockTwo: jest.fn(() => 2),
    mockThree: jest.fn(() => 3),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    mockOne();
    mockTwo();
    mockThree();

    expect(consoleSpy).not.toHaveBeenCalled();

  });

  test('unmockedFunction should log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    unmockedFunction();

    expect(consoleSpy).toBeCalledWith('I am not mocked');
  });
});
