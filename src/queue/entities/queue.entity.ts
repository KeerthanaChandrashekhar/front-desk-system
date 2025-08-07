import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column()
  queueNumber: number;

  @Column()
  status: string; // e.g., "Waiting", "With Doctor", "Completed"
}
