import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  findOne(id: number): Promise<Doctor | null> {
    return this.doctorRepository.findOneBy({ id });
  }

  async update(id: number, updateDoctorDto: Partial<Doctor>): Promise<Doctor | null> {
    await this.doctorRepository.update(id, updateDoctorDto);
    return this.findOne(id); 
  }

  remove(id: number): Promise<void> {
    return this.doctorRepository.delete(id).then(() => undefined);
  }
}
