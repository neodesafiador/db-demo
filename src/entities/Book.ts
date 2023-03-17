import {
    Entity, PrimaryGeneratedColumn, Column, Relation, OneToMany, ManyToMany, JoinTable
  } from "typeorm"
import { Review } from './Review';
import { Author } from './Author';

@Entity()
export class Book {
    @PrimaryGeneratedColumn('uuid')
    bookId: string;

    @Column({ unique: true })
    title: string;

    @Column()
    publishedYear: number;

    @Column({ default: false })
    isPublicDomain: boolean;

    @OneToMany(() => Review, (review) => review.book, { cascade: ['insert', 'update'] })
    reviews: Relation<Review>[];

    @ManyToMany(() => Author, (artist) => artist.books, { cascade: ['insert', 'update'] })
    @JoinTable()
    authors: Relation<Author>[];
}
