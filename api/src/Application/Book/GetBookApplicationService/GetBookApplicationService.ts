import { BookId } from 'Domain/models/Book/BookId/BookId';
import { IBookRepository } from 'Domain/models/Book/IBookRepository';
import { BookDTO } from '../BookDTO';

export class GetBookApplicationService {
  constructor(private bookRepository: IBookRepository) {}

  async execute(isbn: string): Promise<BookDTO | null> {
    const book = await this.bookRepository.find(new BookId(isbn));
    if (!book) {
      return null;
    }

    return new BookDTO(book);
  }
}
