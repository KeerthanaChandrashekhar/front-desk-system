import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateQueueDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;
}
