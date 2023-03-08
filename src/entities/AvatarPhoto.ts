import {
    Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation,
} from "typeorm"
import { User } from "./User"

@Entity()
export class AvatarPhoto {
  @PrimaryGeneratedColumn('uuid')
  avatarPhotoId: string;

  @Column()
  imgPath: string;

  @Column()
  fileSize: number;

  @OneToOne(() => User, (user) => user.avatarPhoto)
  user: Relation<User>;
}
