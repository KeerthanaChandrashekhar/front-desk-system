import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateQueueDto {
  @IsString()
  @IsOptional()
  @IsIn(['waiting', 'with doctor', 'completed'])
  status?: string;
}
