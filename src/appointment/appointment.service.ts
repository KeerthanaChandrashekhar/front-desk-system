import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const doctor = await this.doctorRepository.findOne({ where: { id: dto.doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${dto.doctorId} not found`);
    }

    //   Check doctor availability
    if (dto.appointmentTime < doctor.availableFrom || dto.appointmentTime > doctor.availableTo) {
      throw new BadRequestException(`Doctor is not available at this time`);
    }

    const appointment = this.appointmentRepository.create({
      patientName: dto.patientName,
      appointmentDate: dto.appointmentDate,
      appointmentTime: dto.appointmentTime,
      status: 'booked',
      doctor,
    });

    return this.appointmentRepository.save(appointment);
  }

  findAll() {
    return this.appointmentRepository.find({ order: { appointmentDate: 'ASC', appointmentTime: 'ASC' } });
  }

  async findOne(id: number) {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);

    if (dto.appointmentTime || dto.appointmentDate) {
      const doctor = appointment.doctor;
      if (dto.appointmentTime && (dto.appointmentTime < doctor.availableFrom || dto.appointmentTime > doctor.availableTo)) {
        throw new BadRequestException(`Doctor is not available at this time`);
      }
    }

    Object.assign(appointment, dto);
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number) {
    const appointment = await this.findOne(id);
    return this.appointmentRepository.remove(appointment);
  }
}
