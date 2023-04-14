import { AppDataSource } from '../dataSource';
import { Book } from '../entities/Book';

const bookRepository = AppDataSource.getRepository(Book);

async function addBook(title: string, publicationYear: number | undefined, inPublicDomain: boolean): Promise<Book> {
  // Create the new Book object
  let newBook = new Book();
  newBook.title = title;
  newBook.publicationYear = publicationYear;
  newBook.inPublicDomain = inPublicDomain;

  newBook = await bookRepository.save(newBook);

  return newBook;
}

async function getBookById(bookId: string): Promise<Book | null> {
  return await bookRepository
    .createQueryBuilder('book')
    .leftJoinAndSelect('book.reviews', 'reviews')
    .leftJoinAndSelect('reviews.user', 'user')
    .select(['book', 'reviews', 'user.userId', 'user.email'])
    .where('bookId = :bookId', { bookId })
    .getOne();
}

async function getBooks(): Promise<Book[]> {
  return await bookRepository.find();
}

export { addBook, getBookById, getBooks };