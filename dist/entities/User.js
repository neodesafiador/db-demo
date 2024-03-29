var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, Column, OneToMany, } from 'typeorm';
import { Review } from './Review';
import { Book } from './Book';
let User = class User {
    userId;
    email;
    passwordHash;
    verifiedEmail;
    profileViews;
    reviews;
    books;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "verifiedEmail", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "profileViews", void 0);
__decorate([
    OneToMany(() => Review, (review) => review.user, { cascade: ['insert', 'update'] }),
    __metadata("design:type", Array)
], User.prototype, "reviews", void 0);
__decorate([
    ManyToMany(() => Book, (book) => book.users, { cascade: ['insert', 'update'] }),
    JoinTable(),
    __metadata("design:type", Array)
], User.prototype, "books", void 0);
User = __decorate([
    Entity()
], User);
export { User };
//# sourceMappingURL=User.js.map