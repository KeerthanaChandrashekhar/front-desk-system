import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column()
  doctorName: string;

  @Column()
  date: string; 

  @Column()
  time: string; 

  @Column()
  status: string; 
}

