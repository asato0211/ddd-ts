import { StockId } from './StockId';

// nanoid をモック
jest.mock('nanoid', () => ({
  nanoid: () => 'testIdWithExactLength',
}));

describe('StockId', () => {
  test('デフォルトの値でStockIdを生成', () => {
    const stockId = new StockId();
    expect(stockId.value).toBe('testIdWithExactLength');
  });

  test('指定された値でStockIdを生成', () => {
    const value = 'customId';
    const stockId = new StockId(value);
    expect(stockId.value).toBe(value);
  });

  test('最小長以下の値でStockIdを生成すると例外放出', () => {
    const shortValue = '';
    expect(() => new StockId(shortValue)).toThrow(
      `StockIdは${StockId.MIN_LENGTH}文字以上、${StockId.MAX_LENGTH}文字以下でなければなりません。`
    );
  });

  test('最大長以上の値でStockIdを生成すると例外放出', () => {
    const longValue = 'a'.repeat(StockId.MAX_LENGTH + 1);
    expect(() => new StockId(longValue)).toThrow(
      `StockIdは${StockId.MIN_LENGTH}文字以上、${StockId.MAX_LENGTH}文字以下でなければなりません。`
    );
  });
});
