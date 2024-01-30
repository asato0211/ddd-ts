import { Price } from './Price';

describe('Price', () => {
  test('正しい値と通貨コードJPYで有効なPriceを作成', () => {
    const validAmount = 500;
    const price = new Price({ amount: validAmount, currency: 'JPY' });
    expect(price.amount).toBe(validAmount);
    expect(price.currency).toBe('JPY');
  });

  test('無効な通貨コードの場合は例外放出', () => {
    const invalidCurrency = 'USD';
    expect(() => {
      // @ts-expect-error
      new Price({ amount: 500, currency: invalidCurrency });
    }).toThrow('現在は日本円のみを扱います。');
  });

  test('MIN未満の値でPriceを生成すると例外放出', () => {
    const lessThanMin = Price.MIN - 1;
    expect(() => {
      new Price({ amount: lessThanMin, currency: 'JPY' });
    }).toThrow(
      `価格は${Price.MIN}円から${Price.MAX}円の間でなければなりません。`
    );
  });

  test('MAX超の値でPriceを生成すると例外放出', () => {
    const moreThanMax = Price.MAX + 1;
    expect(() => {
      new Price({ amount: moreThanMax, currency: 'JPY' });
    }).toThrow(
      `価格は${Price.MIN}円から${Price.MAX}円の間でなければなりません。`
    );
  });
});
