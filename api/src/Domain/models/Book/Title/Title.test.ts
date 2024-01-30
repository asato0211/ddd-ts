import { Title } from './Title';

describe('Title', () => {
  test('Titleが1文字で作成できることを確認', () => {
    expect(new Title('a').value).toBe('a');
  });

  test('Titleが1000文字で作成できることを確認', () => {
    const longTitle = 'a'.repeat(1000);
    expect(new Title(longTitle).value).toBe(longTitle);
  });

  test('最小長以上の値でTitleを生成すると例外放出', () => {
    expect(() => new Title('')).toThrow(
      'タイトルは1文字以上、1000文字以下でなければなりません。'
    );
  });

  test('最大長以上の値でTitleを生成すると例外放出', () => {
    const tooLongTitle = 'a'.repeat(1001);
    expect(() => new Title(tooLongTitle)).toThrow(
      'タイトルは1文字以上、1000文字以下でなければなりません。'
    );
  });
});
