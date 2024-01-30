import { ValueObject } from 'Domain/models/shared/ValueObject';

export enum StatusEnum {
  InStock = 'InStock',
  LowStock = 'LowStock',
  OutOfStock = 'OutOfStock',
}

export type StatusLabel = '在庫あり' | '残りわずか' | '在庫切れ';

export class Status extends ValueObject<StatusEnum, 'Status'> {
  constructor(value: StatusEnum) {
    super(value);
  }

  protected validate(value: StatusEnum): void {
    if (!Object.values(StatusEnum).includes(value)) {
      throw new Error('無効なステータスです。');
    }
  }

  toLabel(): StatusLabel {
    switch (this._value) {
      case StatusEnum.InStock:
        return '在庫あり';
      case StatusEnum.LowStock:
        return '残りわずか';
      case StatusEnum.OutOfStock:
        return '在庫切れ';
    }
  }
}
