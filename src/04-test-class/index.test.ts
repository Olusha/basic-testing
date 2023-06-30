// Uncomment the code below and write your tests
// import { getBankAccount } from '.';

import {BankAccount, InsufficientFundsError, TransferFailedError} from './index';

fdescribe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 5;
    const instance = new BankAccount(balance);

    expect(instance.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 5;
    const withdrawAmount = 6;
    const instance = new BankAccount(balance);

    expect(() => instance.withdraw(withdrawAmount)).toThrowError(
        InsufficientFundsError
    );
  });

  test('should throw error when transferring more than balance', () => {
    const balance = 5;
    const transferAmount = 6;
    const currentAccount = new BankAccount(balance);
    const transferAccount = new BankAccount(balance);

    expect(() =>
      currentAccount.transfer(transferAmount, transferAccount),
    ).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 5;
    const transferAmount = 4;
    const currentAccount = new BankAccount(balance);

    expect(() =>
        currentAccount.transfer(transferAmount, currentAccount),
    ).toThrowError(TransferFailedError);
  });

  test('should deposit money', () => {
    const balance = 5;
    const depositAmount = 5;
    const currentAccount = new BankAccount(balance);

    expect(currentAccount.deposit(depositAmount).getBalance()).toBe(10);
  });

  test('should withdraw money', () => {
    const balance = 5;
    const withdrawAmount = 5;
    const instance = new BankAccount(balance);

    expect(instance.withdraw(withdrawAmount).getBalance()).toBe(0);
  });

  test('should transfer money', () => {
    const balance = 5;
    const transferAmount = 5;
    const currentAccount = new BankAccount(balance);
    const transferAccount = new BankAccount(0);
    currentAccount.transfer(transferAmount, transferAccount);

    expect(transferAccount.getBalance()).toBe(transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    // const balance = 5;
    // const currentAccount = new BankAccount(balance);
    // jest.spyOn(Math, 'random', 'set' as never).and.returnValue(1);
    // const result = await currentAccount.fetchBalance();
    //
    // expect(typeof result).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    // Write your tests here
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    // Write your tests here
  });
});
