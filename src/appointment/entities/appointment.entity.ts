import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column()
  appointmentDate: string; // YYYY-MM-DD

  @Column()
  appointmentTime: string; // HH:mm

  @Column({ default: 'booked' })
  status: string; // booked, completed, canceled

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { eager: true })
  doctor: Doctor;
}

