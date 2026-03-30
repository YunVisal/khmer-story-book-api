import { Chapter } from 'src/chapters/chapters.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

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

  @OneToOne(() => Chapter, (chapter) => chapter.content)
  @JoinColumn()
  chapter: Chapter;

  @BeforeInsert()
  beforeCreate() {
    this.isDeleted = false;
  }
}
