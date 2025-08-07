import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';

describe('DoctorService', () => {
  let service: DoctorService;
  let repo: Repository<Doctor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: getRepositoryToken(Doctor),
          useClass: Repository, // mocking the repository
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    repo = module.get<Repository<Doctor>>(getRepositoryToken(Doctor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more unit tests here
});

