import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger } from './console.logger.service'; // ConsoleLogger의 경로를 맞춰주세요
import { getRepositoryToken } from '@nestjs/typeorm';
import { Log } from './entities/logger.entity';
import * as fs from 'fs';

jest.mock('fs');

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let logRepository: any;

  beforeEach(async () => {
    logRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsoleLogger,
        {
          provide: getRepositoryToken(Log),
          useValue: logRepository,
        },
      ],
    }).compile();

    logger = module.get<ConsoleLogger>(ConsoleLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should error log', async () => {
    const message = 'This is an error';
    const stack = 'Error stack trace';

    await logger.error(message, stack);

    expect(logRepository.create).toHaveBeenCalledWith({
      level: 'ERROR',
      message: expect.stringContaining(message),
      context: null,
    });
    expect(fs.appendFile).toHaveBeenCalled(); // 파일에 로그가 추가되었는지 확인
  });

  it('should warn log', async () => {
    const message = 'This is a warning';

    await logger.warn(message);

    expect(logRepository.create).toHaveBeenCalledWith({
      level: 'WARN',
      message: expect.stringContaining(message),
      context: null,
    });
    expect(fs.appendFile).toHaveBeenCalled();
  });

  it('should debug log', async () => {
    const message = 'This is a debug message';

    await logger.debug(message);

    expect(logRepository.create).toHaveBeenCalledWith({
      level: 'DEBUG',
      message: expect.stringContaining(message),
      context: null,
    });
    expect(fs.appendFile).toHaveBeenCalled();
  });

});
