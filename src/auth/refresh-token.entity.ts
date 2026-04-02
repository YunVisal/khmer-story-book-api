import { User } from 'src/user/user.entity';
import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tokenHash: string;

  @Column()
  expiryDate: Date;

  @Column()
  isDeleted: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  modifiedDate: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @BeforeInsert()
  beforeCreate() {
    this.isDeleted = false;
  }
}
