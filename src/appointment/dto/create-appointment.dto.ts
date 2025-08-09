import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsString()
  @IsNotEmpty()
  appointmentDate: string; // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  appointmentTime: string; // HH:mm

  @IsNumber()
  @IsNotEmpty()
  doctorId: number;
}


