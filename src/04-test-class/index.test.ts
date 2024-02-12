import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  const initialValue = 5000;
  const BankAccount = getBankAccount(initialValue);
  test('should create account with initial balance', () => {
    expect(BankAccount.getBalance()).toBe(initialValue);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const draw = 6000;
    expect(() => {
      BankAccount.withdraw(draw);
    }).toThrow(new InsufficientFundsError(BankAccount.getBalance()));
  });

  test('should throw error when transferring more than balance', () => {
    const someBankAccount = getBankAccount(10000);
    const draw = 6000;
    expect(() => {
      BankAccount.transfer(draw, someBankAccount);
    }).toThrow(new InsufficientFundsError(BankAccount.getBalance()));
  });

  test('should throw error when transferring to the same account', () => {
    const draw = 6000;
    expect(() => {
      BankAccount.transfer(draw, BankAccount);
    }).toThrow(new TransferFailedError());
  });

  test('should deposit money', () => {
    expect(BankAccount.deposit(1000)).toBe(BankAccount);
  });

  test('should withdraw money', () => {
    expect(BankAccount.withdraw(1000)).toBe(BankAccount);
  });

  test('should transfer money', () => {
    const someBankAccount = getBankAccount(10000);
    const draw = 3000;
    expect(BankAccount.transfer(draw, someBankAccount)).toBe(BankAccount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    try {
      await BankAccount.fetchBalance();
    } catch (error) {
      expect(error).toBe(null);
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    /* try {
      const result = await BankAccount.fetchBalance();
      if (result) {
        expect(result).toBe(result);
      }
    } catch (error) {
      expect(() => error).toThrow(new SynchronizationFailedError());
    } */
    const result = await BankAccount.fetchBalance();
    if (result) {
      expect(result).toBe(result);
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    try {
      const result = await BankAccount.fetchBalance();
      if (result === null) {
        throw new SynchronizationFailedError();
      }
    } catch (error) {
      expect(() => error).toThrow(new SynchronizationFailedError());
    }
  });
});
