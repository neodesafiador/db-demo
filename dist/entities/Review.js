var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, Check, ManyToOne } from 'typeorm';
import { User } from './User';
import { Book } from './Book';
let Review = class Review {
    reviewId;
    rating;
    reviewText;
    user;
    book;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Review.prototype, "reviewId", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Review.prototype, "reviewText", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.reviews, { cascade: ['insert', 'update'] }),
    __metadata("design:type", Object)
], Review.prototype, "user", void 0);
__decorate([
    ManyToOne(() => Book, (book) => book.reviews, { cascade: ['insert', 'update'] }),
    __metadata("design:type", Object)
], Review.prototype, "book", void 0);
Review = __decorate([
    Entity(),
    Check('rating >= 0 and rating <= 5')
], Review);
export { Review };
//# sourceMappingURL=Review.js.map