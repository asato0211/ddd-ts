import { Stock } from './Stock';
import { QuantityAvailable } from './QuantityAvailable/QuantityAvailable';
import { Status, StatusEnum } from './Status/Status';
import { StockId } from './StockId/StockId';

// nanoid をモック
jest.mock('nanoid', () => ({
  nanoid: () => 'testIdWithExactLength',
}));

describe('Stock', () => {
  const stockId = new StockId('abc');
  const quantityAvailable = new QuantityAvailable(100);
  const status = new Status(StatusEnum.InStock);

  describe('create', () => {
    test('デフォルト値で在庫を作成', () => {
      const stock = Stock.create();

      expect(stock.stockId.equals(new StockId('testIdWithExactLength'))).toBeTruthy();
      expect(stock.quantityAvailable.equals(new QuantityAvailable(0))).toBeTruthy();
      expect(stock.status.equals(new Status(StatusEnum.OutOfStock))).toBeTruthy();
    });
  });

  describe('delete', () => {
    test('在庫なしの場合は削除できる', () => {
      const notOnSaleStatus = new Status(StatusEnum.OutOfStock);
      const stock = Stock.reconstruct(stockId, quantityAvailable, notOnSaleStatus);

      expect(() => stock.delete()).not.toThrow();
    });

    test('在庫ありの場合は例外放出', () => {
      const stock = Stock.reconstruct(stockId, quantityAvailable, status);

      expect(() => stock.delete()).toThrow('在庫がある場合削除できません。');
    });
  });

  describe('increaseQuantity', () => {
    test('在庫数を増やす', () => {
      const stock = Stock.reconstruct(stockId, quantityAvailable, status);
      stock.increaseQuantity(5);

      expect(stock.quantityAvailable.equals(new QuantityAvailable(105))).toBeTruthy();
    });

    test('増加量が負の数の場合は例外放出', () => {
      const stock = Stock.reconstruct(stockId, quantityAvailable, status);

      expect(() => stock.increaseQuantity(-1)).toThrow(
        '増加量は0以上でなければなりません。'
      );
    });

    test('在庫数が10以下だったらステータスが「残りわずか」になる', () => {
      const stock = Stock.reconstruct(stockId, new QuantityAvailable(9), status);
      stock.increaseQuantity(1);

      expect(stock.quantityAvailable.equals(new QuantityAvailable(10))).toBeTruthy();
      expect(stock.status.equals(new Status(StatusEnum.LowStock))).toBeTruthy();
    });

    test('在庫数が10以上になったらステータスが「在庫あり」になる', () => {
      const stock = Stock.reconstruct(stockId, new QuantityAvailable(10), status);
      stock.increaseQuantity(1);

      expect(stock.quantityAvailable.equals(new QuantityAvailable(11))).toBeTruthy();
      expect(stock.status.equals(new Status(StatusEnum.InStock))).toBeTruthy();
    });
  });

  describe('decreaseQuantity', () => {
    test('在庫数を減らす', () => {
      const stock = Stock.reconstruct(stockId, quantityAvailable, status);
      stock.decreaseQuantity(5);

      expect(stock.quantityAvailable.equals(new QuantityAvailable(95))).toBeTruthy();
    });

    test('減少量が負の数の場合は例外放出', () => {
      const stock = Stock.reconstruct(stockId, quantityAvailable, status);

      expect(() => stock.decreaseQuantity(-1)).toThrow(
        '減少量は0以上でなければなりません。'
      );
    });

    test('減少後の在庫数が0未満になる場合は例外放出', () => {
      const stock = Stock.reconstruct(stockId, quantityAvailable, status);

      expect(() => stock.decreaseQuantity(101)).toThrow();
    });

    test('在庫数が0になったらステータスが「在庫切れ」になる', () => {
      const stock = Stock.reconstruct(stockId, quantityAvailable, status);
      stock.decreaseQuantity(100);

      expect(stock.quantityAvailable.equals(new QuantityAvailable(0))).toBeTruthy();
      expect(stock.status.equals(new Status(StatusEnum.OutOfStock))).toBeTruthy();
    });

    test('在庫数が10以下になったらステータスが「残りわずか」になる', () => {
      const stock = Stock.reconstruct(stockId, quantityAvailable, status);
      stock.decreaseQuantity(90);

      expect(stock.quantityAvailable.equals(new QuantityAvailable(10))).toBeTruthy();
      expect(stock.status.equals(new Status(StatusEnum.LowStock))).toBeTruthy();
    });
  });
});
