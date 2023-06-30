// Uncomment the code below and write your tests
// import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

// import * as fs from 'fs';

// jest.mock('fs');
jest.mock('path');
jest.mock('fs/promises');
jest.mock('globals');


// import {doStuffByTimeout} from './index';
import spyOn = jest.spyOn;

// import path from 'path';
import {doStuffByInterval, doStuffByTimeout, readFileAsynchronously} from './index';
// import * as fs from 'fs';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    const timeout = 100;
    const sp = spyOn(global, 'setTimeout');
    doStuffByTimeout(cb, timeout);

    expect(sp).toBeCalledWith(cb, timeout);
  });

  test('should call callback only after timeout', () => {
    const logValue = 1;
    const cb = () => console.log(logValue);
    const logSpy = spyOn(console, 'log');
    const timeout = 100;

    doStuffByTimeout(cb, timeout);

    expect(logSpy).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(logSpy).toBeCalledWith(logValue);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    const interval = 100;
    const sp = spyOn(global, 'setInterval');
    doStuffByInterval(cb, interval);

    expect(sp).toBeCalledWith(cb, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const logValue = 1;
    const cb = () => console.log(logValue);
    const logSpy = spyOn(console, 'log');
    const interval = 100;
    const n = 6;
    const time = interval * n;

    doStuffByInterval(cb, interval);

    expect(logSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(time);

    expect(logSpy).toBeCalledWith(logValue);
    expect(logSpy).toBeCalledTimes(n);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    // const mockFs = jest.createMockFromModule('fs');
    // const mockPath = jest.createMockFromModule('path');
    //
    jest.mock('fs', () => {
      return {
        existsSync: () => false,
      };
    });

    const sp = spyOn(path, 'join');

    const pathToFile = 'test';
    await readFileAsynchronously(pathToFile);
    expect(sp.mock.calls?.[0]?.[1]).toBe(pathToFile);
  });

  test('should return null if file does not exist', async () => {
    // spyOn(fs, 'existsSync').mockReturnValue(false);
    // jest.mock('fs', () => {
    //   return {
    //     existsSync: () => false,
    //   };
    // });
    // const res = await readFileAsynchronously('');
    // expect(res).toBe(null);

  });

  test('should return file content if file exists', async () => {
    // jest.mock('fs', () => {
    //   return {
    //     existsSync: () => true,
    //   };
    // });
    //
    // const res = await readFileAsynchronously('');
    // expect(res).toBe('test');
  });
});
