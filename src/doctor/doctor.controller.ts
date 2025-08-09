import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query, 
} from '@nestjs/common';
import { DoctorsService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorsService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doctor = await this.doctorService.findOne(+id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  @Get()
  findAll(
    @Query('specialization') specialization?: string,
    @Query('location') location?: string,
    @Query('availableFrom') availableFrom?: string,
    @Query('availableTo') availableTo?: string,
  ) {
    console.log('GET /doctor called with filters:', {
      specialization,
      location,
      availableFrom,
      availableTo,
    });
    return this.doctorService.findAll({
      specialization,
      location,
      availableFrom,
      availableTo,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: Partial<Doctor>,
  ) {
    const updatedDoctor = await this.doctorService.update(+id, updateDoctorDto);
    if (!updatedDoctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return updatedDoctor;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const doctor = await this.doctorService.findOne(+id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    await this.doctorService.remove(+id);
    return { message: `Doctor with ID ${id} has been deleted` };
  }
}
