import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './entities/queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { Doctor } from '../doctor/entities/doctor.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private readonly queueRepository: Repository<Queue>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(dto: CreateQueueDto) {
    const doctor = await this.doctorRepository.findOne({ where: { id: dto.doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${dto.doctorId} not found`);
    }

    //  Check doctor availability
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    if (currentTime < doctor.availableFrom || currentTime > doctor.availableTo) {
      throw new BadRequestException(`Doctor is not available at this time`);
    }

    // Auto-assign queue number
    const lastQueue = await this.queueRepository.find({
      where: { doctor },
      order: { queueNumber: 'DESC' },
      take: 1,
    });
    const queueNumber = lastQueue.length > 0 ? lastQueue[0].queueNumber + 1 : 1;

    const queueEntry = this.queueRepository.create({
      patientName: dto.patientName,
      status: 'waiting',
      doctor,
      queueNumber,
    });

    return this.queueRepository.save(queueEntry);
  }

  findAll() {
    return this.queueRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  async updateStatus(id: number, dto: UpdateQueueDto) {
    const queueEntry = await this.queueRepository.findOne({ where: { id } });
    if (!queueEntry) throw new NotFoundException('Queue entry not found');

    if (dto.status) queueEntry.status = dto.status;
    return this.queueRepository.save(queueEntry);
  }

  async remove(id: number) {
    const queueEntry = await this.queueRepository.findOne({ where: { id } });
    if (!queueEntry) throw new NotFoundException('Queue entry not found');

    return this.queueRepository.remove(queueEntry);
  }
}

