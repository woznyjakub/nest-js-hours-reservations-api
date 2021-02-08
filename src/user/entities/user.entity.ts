import { Reservation } from '../../reservation/entities/reservation.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../../interfaces/user';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
  })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    default: UserRole.User,
  })
  role: UserRole;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  @JoinColumn()
  reservations: Reservation[];
}
