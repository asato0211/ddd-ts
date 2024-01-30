import { QuantityAvailable } from './QuantityAvailable/QuantityAvailable';
import { Status, StatusEnum } from './Status/Status';
import { StockId } from './StockId/StockId';

export class Stock {
  // メソッドを通してのみ変更可とする
  // 属性を変更するメソッドにビジネスルールを適用する事でエンティティの整合性を保つ
  private constructor(
    private readonly _stockId: StockId,
    private _quantityAvailable: QuantityAvailable,
    private _status: Status,
  ) {}

  // 新規生成
  // ビジネスルールに沿った初期状態を表現
  static create() {
    const defaultStockId = new StockId(); // 自動ID採番
    const defaultQuantityAvailable = new QuantityAvailable(0);
    const defaultStatus = new Status(StatusEnum.OutOfStock);

    return new Stock(defaultStockId, defaultQuantityAvailable, defaultStatus);
  }

  // 再構築
  static reconstruct(stockId: StockId, quantityAvailable: QuantityAvailable, status: Status) {
    return new Stock(stockId, quantityAvailable, status);
  }

  delete() {
    if (this.status.value !== StatusEnum.OutOfStock) {
      throw new Error('在庫がある場合削除できません。');
    }
  }

  // 在庫数を増やす
  increaseQuantity(amount: number) {
    if (amount < 0) {
      throw new Error('増加量は0以上でなければなりません。');
    }

    const newQuantity = this.quantityAvailable.increment(amount).value;

    // 在庫数が10以下ならステータスを「残りわずか」にする
    if (newQuantity <= 10) {
      this.changeStatus(new Status(StatusEnum.LowStock));
    }

    // 在庫数が10以上ならステータスを「在庫あり」にする
    if (newQuantity > 10) {
      this.changeStatus(new Status(StatusEnum.InStock));
    }

    this._quantityAvailable = new QuantityAvailable(newQuantity);
  }

  // 在庫数を減らす
  decreaseQuantity(amount: number) {
    if (amount < 0) {
      throw new Error('減少量は0以上でなければなりません。');
    }

    const newQuantity = this.quantityAvailable.decrement(amount).value;

    // 在庫数が10以下ならステータスを「残りわずか」にする
    if (newQuantity <= 10) {
      this.changeStatus(new Status(StatusEnum.LowStock));
    }

    // 在庫数が0になったらステータスを「在庫切れ」にする
    if (newQuantity === 0) {
      this.changeStatus(new Status(StatusEnum.OutOfStock));
    }

    this._quantityAvailable = new QuantityAvailable(newQuantity);
  }

  private changeStatus(newStatus: Status) {
    this._status = newStatus;
  }

  get stockId(): StockId {
    return this._stockId;
  }

  get quantityAvailable(): QuantityAvailable {
    return this._quantityAvailable;
  }

  get status(): Status {
    return this._status;
  }
}