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
    return await userRepository.findOne({ where: { email } });
}
async function allUserData() {
    return await userRepository.find();
}
async function getUserById(userId) {
    const user = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.reviews', 'reviews')
        .where('user.userId = :userId', { userId })
        .getOne();
    return user;
}
async function getUsersByViews(minViews) {
    const users = await userRepository
        .createQueryBuilder('user')
        .where('profileViews >= :minViews', { minViews }) // NOTES: the parameter `:minViews` must match the key name `minViews`
        .select(['user.email', 'user.profileViews', 'user.userId'])
        .getMany();
    return users;
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
async function resetAllProfileViews() {
    await userRepository
        .createQueryBuilder()
        .update(User)
        .set({ profileViews: 0 })
        .where('verifiedEmail <> true')
        .execute();
}
async function updateEmailAddress(userId, newEmail) {
    await userRepository
        .createQueryBuilder()
        .update(User)
        .set({ email: newEmail })
        .where({ userId })
        .execute();
}
export { addUser, getUserByEmail, getUserById, getUsersByViews, incrementProfileViews, allUserData, resetAllProfileViews, updateEmailAddress, };
//# sourceMappingURL=UserModel.js.map