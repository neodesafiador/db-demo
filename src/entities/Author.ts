import {
    Entity, PrimaryGeneratedColumn, Column, ManyToMany, Relation, JoinTable
  } from "typeorm"
import { Book } from './Book';
  
@Entity()
export class Author {
    @PrimaryGeneratedColumn('uuid')
    authorId: string;

    @Column({ unique: true })
    name: string;

    @Column({ default: `unknown` })
    countryOrigin: string;

    @ManyToMany(() => Book, (book) => book.authors, { cascade: true })
    @JoinTable()
    books: Relation<Book>[];

}