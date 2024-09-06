import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as moment from 'moment-timezone';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  level: string;

  @Column('text')
  message: string;

  @Column('text', { nullable: true })
  context: string;

  @Column('text')
  createdDt: string;

  @BeforeInsert()
  setCreatedDt() {
    this.createdDt = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }
}
