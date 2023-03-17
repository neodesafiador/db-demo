import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, 
  JoinColumn, Relation, OneToMany,
} from "typeorm"
import { AvatarPhoto } from './AvatarPhoto';
import { Review } from './Review';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 0 })
  profileViews: number;

  @OneToOne(() => AvatarPhoto, (avatarPhoto) => avatarPhoto.user, { cascade: ['insert', 'update'] })
  @JoinColumn()
  avatarPhoto: Relation<AvatarPhoto>;

  @OneToMany(() => Review, (review) => review.user, { cascade: ['insert', 'update'] })
  reviews: Relation<Review>[];
}
