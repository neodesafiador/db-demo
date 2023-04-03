import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(firstName: string, lastName: string, email: string, passwordHash: string): Promise<User> {
  // Create the new user object
  let newUser = new User();
  newUser.firstName = firstName;
  newUser.lastName = lastName;
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // Then save it to the database
  // We reassign to `newUser` so we can access
  // the fields the database autogenerates (the id & default columns)
  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null> {
  return await userRepository.findOne({ where: { email } });
}

async function allUserData(): Promise<User[]> {
  return await userRepository.find();
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository
    .createQueryBuilder('user')
    .where({ userId })
    .leftJoinAndSelect('user.reviews', 'reviews')
    .where('user.userId = :userId', { userId })
    .getOne();

  return user;
}

async function getUsersByViews(minViews: number): Promise<User[]> {
  const users = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :minViews', { minViews }) // the parameter `:minViews` must match the key name `minViews`
    .select(['user.email', 'user.profileViews', 'user.joinedOn', 'user.userId'])
    .getMany();

  return users;
}

async function incrementProfileViews(userData: User): Promise<User> {
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

async function resetAllProfileViews(): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: 0 })
    .where('verifiedEmail <> true')
    .execute();
}

async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ email: newEmail })
    .where({ userId })
    .execute();
}

export {
  addUser,
  getUserByEmail,
  getUserById,
  getUsersByViews,
  incrementProfileViews,
  allUserData,
  resetAllProfileViews,
  updateEmailAddress,
};