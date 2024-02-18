import { ITransactionManager } from 'Application/shared/ITransactionManager';
import { BookId } from 'Domain/models/Book/BookId/BookId';
import { IBookRepository } from 'Domain/models/Book/IBookRepository';
import { injectable, inject } from 'tsyringe';
import { IDomainEventPublisher } from 'Domain/shared/DomainEvent/IDomainEventPublisher';

export type IncreaseBookStockCommand = {
  bookId: string;
  incrementAmount: number;
};

@injectable()
export class IncreaseBookStockApplicationService {
  constructor(
    @inject('IBookRepository')
    private bookRepository: IBookRepository,
    @inject('ITransactionManager')
    private transactionManager: ITransactionManager,
    @inject('IDomainEventPublisher')
    private domainEventPublisher: IDomainEventPublisher
  ) {}

  async execute(command: IncreaseBookStockCommand): Promise<void> {
    await this.transactionManager.begin(async () => {
      const book = await this.bookRepository.find(new BookId(command.bookId));

      if (!book) {
        throw new Error('書籍が存在しません');
      }

      // Book集約が在庫を増やすメソッドを持っている為、ドメイン知識を意識せずに済む
      book.increaseStock(command.incrementAmount);

      await this.bookRepository.update(book, this.domainEventPublisher);
    });
  }
}
