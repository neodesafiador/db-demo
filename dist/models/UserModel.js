import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
const userRepository = AppDataSource.getRepository(User);
async function addUser(email, passwordHash) {
    // Create the new user object
    let newUser = new User();
    newUser.email = email;
    newUser.passwordHash = passwordHash;
    // Then save it to the database
    // NOTES: We reassign to `newUser` so we can access
    // NOTES: the fields the database autogenerates (the id & default columns)
    newUser = await userRepository.save(newUser);
    return newUser;
}
async function getUserByEmail(email) {
    const user = await userRepository.findOne({ where: { email } });
    return user;
}
async function getUserById(userId) {
    const user = await userRepository
        .createQueryBuilder('user')
        .where({ userId })
        .select([
        'user.email', 'user.profileViews',
        'user.joinedOn', 'user.userId'
    ])
        .getOne();
    return user;
}
async function getUsersByViews(minViews) {
    const viralUsers = await userRepository
        .createQueryBuilder('user')
        .where('profileViews >= :minViews', { minViews })
        .select([
        'user.verifiedEmail'
    ])
        .getMany();
    return viralUsers;
}
async function getAllUsers() {
    // We use no criteria so this will get all users
    return await userRepository.find();
}
async function getAllUnverifiedUsers() {
    return userRepository.find({
        select: { email: true, userId: true },
        where: { verifiedEmail: false },
    });
}
async function getViralUsers() {
    const viralUsers = await userRepository
        .createQueryBuilder('user')
        .where('profileViews >= :viralAmount', { viralAmount: 1000 })
        .select(['user.email', 'user.profileViews'])
        .getMany();
    return viralUsers;
}
export { addUser, getUserByEmail, getUserById, getUsersByViews, getAllUsers, getAllUnverifiedUsers, getViralUsers };
//# sourceMappingURL=UserModel.js.map