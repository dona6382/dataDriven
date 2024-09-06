import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from './type/logger';
import { Log } from './entities/logger.entity';
import { CreateLoggerDto } from './dto/create-logger';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConsoleLogger implements Logger {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  private async saveToDatabase(
    createLogDto: CreateLoggerDto,
  ): Promise<void> {
    const log = this.logRepository.create(createLogDto);
    await this.logRepository.save(log);
  }

  private async saveToFile(
    level: string,
    message: string,
    context?: any,
  ): Promise<void> {
    const logMessage = `[${new Date().toISOString()}] [${level}] ${message} ${
      context ? JSON.stringify(context) : ''
    }\n`;

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식

    // 로그 레벨에 따라 다른 폴더와 파일명 설정
    const folderName = level === 'ERROR' ? 'error_logs' : 'logs';
    const logDirPath = path.join(__dirname, folderName);
    const logFilePath = path.join(
      __dirname,
      folderName,
      `application_${formattedDate}.log`,
    );

    if (!fs.existsSync(logDirPath)) {
      fs.mkdirSync(logDirPath, { recursive: true });
    }

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('로그 파일 저장 실패:', err);
      }
    });
  }

  private async logMessage(
    level: string,
    message: string,
    context?: any,
  ): Promise<void> {
    const logMessage = `[${level}] ${message}`;
    switch (level) {
      case 'ERROR':
        console.error(context ? logMessage : logMessage);
        break;
      case 'WARN':
        console.warn(context ? logMessage : logMessage);
        break;
      case 'DEBUG':
        console.debug(context ? logMessage : logMessage);
        break;
      case 'VERBOSE':
        console.info(context ? logMessage : logMessage);
        break;
      case 'LOG':
        break;
    }

    const createLoggerDto: CreateLoggerDto = {
      level,
      message,
      context: context ? JSON.stringify(context) : null,
    };
    await this.saveToDatabase(createLoggerDto);
    await this.saveToFile(level, message, context);
  }

  async error(message: string, stack?: string, context?: any): Promise<void> {
    await this.logMessage('ERROR', `${message} ${stack ? stack : ''}`, context);
  }

  async log(message: string, context?: any): Promise<void> {
    await this.logMessage('LOG', message, context);
  }

  async warn(message: string, context?: any): Promise<void> {
    await this.logMessage('WARN', message, context);
  }

  async debug(message: string, context?: any): Promise<void> {
    await this.logMessage('DEBUG', message, context);
  }

  async verbose(message: string, context?: any): Promise<void> {
    await this.logMessage('VERBOSE', message, context);
  }
}
