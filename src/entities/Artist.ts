import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Relation, JoinTable } from 'typeorm';
import { Group } from './Group';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  artistId: string;

  @Column()
  name: string;

  @Column()
  birthYear: Date;

  @ManyToMany(() => Group, (group) => group.members, { cascade: true })
  @JoinTable()
  groups: Relation<Group>[];
}
