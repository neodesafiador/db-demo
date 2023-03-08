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

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 0 })
  profileViews: number;

  // @Column({ default: 0 })
  // updateEmail: string;

  @OneToOne(() => AvatarPhoto, (avatarPhoto) => avatarPhoto.user)

  @JoinColumn()
  avatarPhoto: Relation<AvatarPhoto>;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Relation<Review>[];

}
