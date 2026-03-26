import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  description: string;

  @Column()
  coverImageUrl: string;

  @Column()
  language: string;

  @Column()
  isDeleted: boolean;

  @Column()
  createdUser: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  modifiedUser: string;

  @UpdateDateColumn()
  modifiedDate: Date;

  @BeforeInsert()
  beforeCreate() {
    this.isDeleted = false;
  }
}
