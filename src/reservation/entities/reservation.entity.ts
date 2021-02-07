import { User } from '../../user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationStatus } from '../../interfaces/reservation';

@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: ReservationStatus;

  @Column()
  startDate: Date;

  // @ManyToOne(() => User, (user) => user.reservations)
  // user: User;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
