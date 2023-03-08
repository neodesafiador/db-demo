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
async function resetAllProfileViews() {
    await userRepository
        .createQueryBuilder()
        .update(User)
        .set({ profileViews: 0 })
        .where('unverified <> true')
        .execute();
}
async function incrementProfileViews(userData) {
    const updatedUser = userData;
    updatedUser.profileViews += 1;
    await userRepository
        .createQueryBuilder()
        .update(User)
        .set({ profileViews: updatedUser.profileViews })
        .where({ userId: updatedUser.userId })
        .execute();
    return updatedUser;
}
async function updateEmailAddress(userId, newEmail) {
    // TODO: Implement me!
}
// test getUsersByViews() function
const users = await getUsersByViews(250);
console.log(users);
export { addUser, getUserByEmail, getUserById, getUsersByViews, getAllUsers, getAllUnverifiedUsers, getViralUsers, resetAllProfileViews, incrementProfileViews, updateEmailAddress };
//# sourceMappingURL=UserModel.js.map