import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  create(dto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create(dto);
    return this.doctorRepository.save(doctor);
  }

  async findAll(filters?: any) {
    const where: any = {};

    if (filters?.specialization) {
      where.specialization = Like(`%${filters.specialization}%`);
    }
    if (filters?.location) {
      where.location = Like(`%${filters.location}%`);
    }
    if (filters?.availableFrom) {
      where.availableFrom = filters.availableFrom;
    }
    if (filters?.availableTo) {
      where.availableTo = filters.availableTo;
    }

    return this.doctorRepository.find({
      where,
      relations: ['appointments'], // ✅ include related appointments
      order: { id: 'ASC' }, // optional: order by doctor ID
    });
  }

  async findOne(id: number) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['appointments'],
    });
    if (!doctor) throw new NotFoundException(`Doctor with ID ${id} not found`);
    return doctor;
  }

  async update(id: number, dto: Partial<UpdateDoctorDto>) {
    const doctor = await this.findOne(id);
    Object.assign(doctor, dto);
    return this.doctorRepository.save(doctor);
  }

  async remove(id: number) {
    const doctor = await this.findOne(id);
    return this.doctorRepository.remove(doctor);
  }
}

