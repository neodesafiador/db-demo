import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation, ManyToMany } from 'typeorm';
import { Review } from './Review';
import { User } from './User';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  bookId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  publicationYear: number;

  @Column({ default: false })
  inPublicDomain: boolean;

  @OneToMany(() => Review, (review) => review.book, { cascade: ['insert', 'update'] })
  reviews: Relation<Review>[];

  @ManyToMany(() => User, (user) => user.books, { cascade: ['insert', 'update'] })
  users: Relation<User>[];
}
