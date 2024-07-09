import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as brypt from 'bcrypt';
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @UpdateDateColumn()
  update: Date;

  async verifyPassowrd(password: string) {
    const hashPassword = await brypt.hash(password, this.salt);
    return this.password === hashPassword;
  }
}
