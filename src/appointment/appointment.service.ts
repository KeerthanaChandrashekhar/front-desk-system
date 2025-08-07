import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  create(createDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepo.create(createDto);
    return this.appointmentRepo.save(appointment);
  }

  findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  findOne(id: number): Promise<Appointment | null> {
    return this.appointmentRepo.findOneBy({ id });
  }

  async update(id: number, updateDto: Partial<Appointment>): Promise<Appointment | null> {
    await this.appointmentRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.appointmentRepo.delete(id);
  }
}
