import { Reservation } from '../../reservation/entities/reservation.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  passwordHash: string;

  // @OneToMany(() => Reservation, (reservation) => reservation.user)
  // reservations: Reservation[];
}
