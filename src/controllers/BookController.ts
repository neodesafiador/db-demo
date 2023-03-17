


type NewBookRequest

async function addNewBook(req: Request, res: Response): Promise<void> {
    if (!req.session.isLoggedIn) {
        req.sendStatus(401);
        return;
    }

    const { title, publishedYear } = rew.body as NewBookRequest;

    try {
        const newBook = await addNewBook(title, publishedYear);
        console.log(newBook);

    }
}