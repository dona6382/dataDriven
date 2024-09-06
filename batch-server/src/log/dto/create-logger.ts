import { IsString, IsIn } from 'class-validator';

export class CreateLoggerDto {
  @IsString()
  @IsIn(['ERROR', 'WARN', 'DEBUG', 'VERBOSE', 'LOG'])
  level: string;

  @IsString()
  message: string;

  @IsString()
  context?: string;
}
