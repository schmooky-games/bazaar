import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuctionsService } from './auctions.service';
import { Auction } from './entities/auction.entity';
import { BidsService } from '../bids/bids.service';
import { BidsGateway } from '../websockets/bids.gateway';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('AuctionService', () => {
  let service: AuctionsService;
  let repository: Repository<Auction>;
  let bidsService: BidsService;
  let bidsGateway: BidsGateway;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  const mockBidsService = {
    getHighestBidsForAuction: jest.fn(),
  };

  const mockBidsGateway = {
    notifyAuctionEnd: jest.fn(),
    notifyPriceUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        {
          provide: getRepositoryToken(Auction),
          useValue: mockRepository,
        },
        {
          provide: BidsService,
          useValue: mockBidsService,
        },
        {
          provide: BidsGateway,
          useValue: mockBidsGateway,
        },
      ],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
    repository = module.get<Repository<Auction>>(getRepositoryToken(Auction));
    bidsService = module.get<BidsService>(BidsService);
    bidsGateway = module.get<BidsGateway>(BidsGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAuction', () => {
    it('должен создать новый аукцион', async () => {
      const createAuctionDto = {
        name: 'Меч света',
        description: 'Редкий волшебный меч',
        startingPrice: 1000,
        currentPrice: 1000,
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      const expectedAuction = {
        ...createAuctionDto,
        currentPrice: createAuctionDto.startingPrice,
        seller: { id: 'idtest' },
      };

      mockRepository.create.mockReturnValue(expectedAuction);
      mockRepository.save.mockResolvedValue(expectedAuction);

      const result = await service.createAuction(createAuctionDto, 'idtest');

      expect(mockRepository.create).toHaveBeenCalledWith(expectedAuction);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedAuction);
      expect(result).toEqual(expectedAuction);
    });
  });

  describe('getAuctionById', () => {
    it('должен найти аукцион по id', async () => {
      const mockAuction = {
        id: 'test-id',
        name: 'Test Auction',
        seller: { id: 'seller-id' },
      };

      mockRepository.findOne.mockResolvedValue(mockAuction);

      const result = await service.getAuctionById('test-id');
      expect(result).toEqual(mockAuction);
    });

    it('должен выбросить NotFoundException если аукцион не найден', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getAuctionById('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('endAuction', () => {
    it('должен завершить аукцион и вернуть выигравшую ставку', async () => {
      const auctionId = 'test-id';
      const mockAuction = {
        id: auctionId,
        name: 'Test Auction',
      };
      const mockWinningBid = {
        id: 'bid-id',
        amount: 1500,
      };

      mockRepository.findOne.mockResolvedValue(mockAuction);
      mockBidsService.getHighestBidsForAuction.mockResolvedValue(
        mockWinningBid,
      );

      const result = await service.endAuction(auctionId);

      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockBidsGateway.notifyAuctionEnd).toHaveBeenCalledWith(
        auctionId,
        mockWinningBid,
      );
      expect(result).toEqual(mockWinningBid);
    });
  });

  describe('listAuctions', () => {
    it('должен вернуть список аукционов с фильтрами', async () => {
      const mockAuctions = [
        { id: '1', name: 'Auction 1' },
        { id: '2', name: 'Auction 2' },
      ];
      const filters = {
        minPrice: 100,
        maxPrice: 1000,
        searchTerm: 'test',
        active: true,
      };

      mockRepository.find.mockResolvedValue(mockAuctions);

      const result = await service.listAuctions(filters);
      expect(result).toEqual(mockAuctions);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});
