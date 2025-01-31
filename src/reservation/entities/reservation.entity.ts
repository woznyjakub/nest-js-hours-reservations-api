import { User } from '../../user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ReservationItem,
  ReservationStatus,
} from '../../interfaces/reservation';

@Entity()
export class Reservation extends BaseEntity implements ReservationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: ReservationStatus.Available,
  })
  status: ReservationStatus;

  @Column()
  startDate: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
