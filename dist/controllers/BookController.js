import { addBook, getBookById, getBooks } from '../models/BookModel';
async function insertBook(req, res) {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) {
        // res.sendStatus(401);
        res.redirect('/login');
        return;
    }
    const { title, publicationYear, inPublicDomain } = req.body;
    console.log(`inPublicDomain: ${inPublicDomain}`);
    console.log(`inPublicDomain after converting: ${!!inPublicDomain}`);
    const book = await addBook(title, publicationYear, !!inPublicDomain);
    // console.log(book);
    // res.status(201).json(book);
    res.redirect(`/books/${book.bookId}`);
}
async function getBook(req, res) {
    const { bookId } = req.params;
    const book = await getBookById(bookId);
    if (!book) {
        res.sendStatus(404);
        return;
    }
    // res.status(200).json(book);
    res.render('bookPage', { book });
}
async function getAllBooks(req, res) {
    // Don't send back the raw data. Instead render it with EJS
    // res.status(200).json(await getBooks());
    const books = await getBooks();
    res.render('libraryPage', { books });
}
export { insertBook, getBook, getAllBooks };
//# sourceMappingURL=BookController.js.map