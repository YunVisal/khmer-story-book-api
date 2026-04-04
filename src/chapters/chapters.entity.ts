import { Book } from '../books/books.entity';
import { Content } from '../contents/contents.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  chapterNumber: number;

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

  @ManyToOne(() => Book, (book) => book.chapters)
  book: Book;

  @OneToOne(() => Content, (content) => content.chapter)
  content: Content;

  @BeforeInsert()
  beforeCreate() {
    this.isDeleted = false;
  }
}
