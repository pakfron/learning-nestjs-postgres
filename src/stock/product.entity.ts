import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  stock: number;

  @Column({ default: 'noimage.jpg' })
  image: string;

  @UpdateDateColumn()
  updated: Date;
}
