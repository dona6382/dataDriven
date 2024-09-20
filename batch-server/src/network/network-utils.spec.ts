import { Test, TestingModule } from '@nestjs/testing';
import { NetworkService } from './network.service';
import { ConsoleLogger } from '../log/console.logger.service';
import ky from '@toss/ky';

jest.mock('@toss/ky');

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NetworkService,
        {
          provide: ConsoleLogger, // ConsoleLogger를 목으로 제공
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNetworkRequest', () => {
    it('should successfully send a GET request and return JSON response', async () => {
      const mockResponse = { data: 'test' };
      (ky.get as jest.Mock).mockResolvedValueOnce({
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await service.sendNetworkRequest({
        method: 'get',
        url: 'http://localhost:5001/api-docs',
      });

      expect(result).toEqual(mockResponse);
      expect(ky.get).toHaveBeenCalledWith('http://localhost:5001/api-docs', {
        headers: undefined,
        body: undefined,
      });
    });

    it('should retry request', async () => {
      const mockResponse = { data: 'test' };
      (ky.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
          .mockResolvedValueOnce({
            headers: {
              get: jest.fn().mockReturnValue('application/json'),
            },
            json: jest.fn().mockResolvedValueOnce(mockResponse),
          });

      const result = await service.sendNetworkRequest({
        method: 'get',
        url: 'http://localhost:5001/api/product-details?page=1',
        headers: { 'Content-Type': 'application/json' }
      });

      expect(result).toEqual(mockResponse);
    });
  });
});
