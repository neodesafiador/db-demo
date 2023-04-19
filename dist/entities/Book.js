var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Review } from './Review';
import { User } from './User';
let Book = class Book {
    bookId;
    title;
    publicationYear;
    inPublicDomain;
    reviews;
    users;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Book.prototype, "bookId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Object)
], Book.prototype, "publicationYear", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], Book.prototype, "inPublicDomain", void 0);
__decorate([
    OneToMany(() => Review, (review) => review.book, { cascade: ['insert', 'update'] }),
    __metadata("design:type", Array)
], Book.prototype, "reviews", void 0);
__decorate([
    ManyToMany(() => User, (user) => user.books, { cascade: ['insert', 'update'] }),
    __metadata("design:type", Array)
], Book.prototype, "users", void 0);
Book = __decorate([
    Entity()
], Book);
export { Book };
//# sourceMappingURL=Book.js.map