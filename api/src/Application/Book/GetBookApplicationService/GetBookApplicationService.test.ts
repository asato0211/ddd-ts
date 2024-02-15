import { InMemoryBookRepository } from 'Infrastructure/InMemory/Book/InMemoryBookRepository';
import { GetBookApplicationService } from './GetBookApplicationService';
import { bookTestDataCreator } from 'Infrastructure/shared/Book/bookTestDataCreator';
import { BookDTO } from '../BookDTO';

describe('GetBookApplicationService', () => {
  test('指定されたIDの書籍が存在する場合、BookDTOが取得できる', async () => {
    const repository = new InMemoryBookRepository();
    const getBookApplicationService = new GetBookApplicationService(repository);

    const book = await bookTestDataCreator(repository)({});
    const data = await getBookApplicationService.execute(book.bookId.value);

    expect(data).toEqual(new BookDTO(book));
  });

  test('指定されたIDの書籍が存在しない場合、nullが取得できる', async () => {
    const repository = new InMemoryBookRepository();
    const getBookApplicationService = new GetBookApplicationService(repository);

    const data = await getBookApplicationService.execute('9784167158057');

    expect(data).toBeNull();
  });
});
