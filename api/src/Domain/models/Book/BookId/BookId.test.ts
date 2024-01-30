import { BookId } from "./BookId";

describe('BookId', () => {
  test('有効なフォーマットでインスタンスを作成', () => {
    expect(new BookId('9784167158057').value).toBe('9784167158057');
    expect(new BookId('4167158051').value).toBe('4167158051');
  });

  test('無効な文字数の場合は例外放出', () => {
    expect(() => new BookId('1'.repeat(101))).toThrow('ISBNの文字数が不正です');
    expect(() => new BookId('1'.repeat(9))).toThrow('ISBNの文字数が不正です');
  });

  test('無効なフォーマットの場合は例外放出', () => {
    expect(() => new BookId('9994167158057')).toThrow('不正なISBNの形式です');
  });

  test('等価性の確認', () => {
    const bookId1 = new BookId('9784167158057');
    const bookId2 = new BookId('9784167158057');
    const bookId3 = new BookId('9781234567890');

    expect(bookId1.equals(bookId2)).toBeTruthy();
    expect(bookId1.equals(bookId3)).toBeFalsy();
  });

  describe('toISBN', () => {
    test('13桁用のISBNフォーマットに変換', () => {
      const bookId = new BookId('9784167158057');
      expect(bookId.toISBN()).toBe('ISBN978-4-16-715805-7');
    });

    test('10桁用のISBNフォーマットに変換', () => {
      const bookId = new BookId('4167158051');
      expect(bookId.toISBN()).toBe('ISBN4-16-715805-1');
    });
  });
});
