import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { Review } from './Review';
import { Book } from './Book';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 0 })
  profileViews: number;

  @OneToMany(() => Review, (review) => review.user, { cascade: ['insert', 'update'] })
  reviews: Relation<Review>[];

  @ManyToMany(() => Book, (book) => book.users, { cascade: ['insert', 'update'] })
  @JoinTable()
  books: Relation<Book>[];
}
