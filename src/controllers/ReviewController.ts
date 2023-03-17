

async function Something(req: Request, res: Response): Promise<void> {
    TODO:

    const { authenticatedUser } = req.session;
    const user = await getUserById(authenticatedUser.userId);
    const { bookId } = req.params as BookIdRequest;

    const book = await getBookById(bookId);

    if (!user | !book) {
        res.sendStatus(404);  // 404 Not Found
        return;
    }

    const { rating, reviewText } = req.body as NewReviewRequest;

    TODO:
    try {

    }
}