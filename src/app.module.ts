import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor/entities/doctor.entity';
import { DoctorModule } from './doctor/doctor.module';
import { QueueModule } from './queue/queue.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'keerthi2043',
      database: 'clinic_system',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    DoctorModule,
    QueueModule,
    AppointmentModule,
  ],
})
export class AppModule {}

