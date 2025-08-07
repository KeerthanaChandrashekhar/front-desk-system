import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './entities/queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
  ) {}

  create(createQueueDto: CreateQueueDto): Promise<Queue> {
    const queue = this.queueRepository.create(createQueueDto);
    return this.queueRepository.save(queue);
  }

  findAll(): Promise<Queue[]> {
    return this.queueRepository.find();
  }

  findOne(id: number): Promise<Queue | null> {
    return this.queueRepository.findOneBy({ id });
  }

  async update(id: number, updateDto: Partial<Queue>): Promise<Queue | null> {
    await this.queueRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.queueRepository.delete(id);
  }
}
