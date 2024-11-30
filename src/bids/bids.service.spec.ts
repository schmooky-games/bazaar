import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BidsService } from '../bids/bids.service';
import { BidsGateway } from '../websockets/bids.gateway';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Bid } from './entities/bid.entity';
import { Auction } from '../auctions/entities/auction.entity';

describe('BidsService', () => {
  let service: BidsService;
  let bidRepository: Repository<Bid>;
  let auctionRepository: Repository<Auction>;
  let bidsGateway: BidsGateway;

  const mockBidRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAuctionRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  };

  const mockBidsGateway = {
    notifyPriceUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        {
          provide: getRepositoryToken(Bid),
          useValue: mockBidRepository,
        },
        {
          provide: getRepositoryToken(Auction),
          useValue: mockAuctionRepository,
        },
        {
          provide: BidsGateway,
          useValue: mockBidsGateway,
        },
      ],
    }).compile();

    service = module.get<BidsService>(BidsService);
    bidRepository = module.get<Repository<Bid>>(getRepositoryToken(Bid));
    auctionRepository = module.get<Repository<Auction>>(
      getRepositoryToken(Auction),
    );
    bidsGateway = module.get<BidsGateway>(BidsGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('placeBid', () => {
    const mockAuction = {
      id: 'test-auction-id',
      seller: { id: 'seller-id' },
      currentPrice: 100,
      endDate: new Date(Date.now() + 1000000),
    };

    const mockBidDto = {
      auctionId: 'test-auction-id',
      amount: 150,
      bidderId: 'test-bidder-id',
    };

    const mockUserId = 'test-user-id';

    it('должен успешно разместить ставку', async () => {
      const expectedBid = {
        id: expect.any(String),
        amount: mockBidDto.amount,
        auction: { id: mockBidDto.auctionId },
        bidder: { id: mockUserId },
      };

      mockAuctionRepository.findOne.mockResolvedValue(mockAuction);
      mockBidRepository.create.mockReturnValue(expectedBid);
      mockBidRepository.save.mockResolvedValue(expectedBid);

      const result = await service.placeBid(mockBidDto, mockUserId);

      expect(mockBidRepository.create).toHaveBeenCalledWith(expectedBid);
      expect(mockBidRepository.save).toHaveBeenCalledWith(expectedBid);
      expect(mockAuctionRepository.update).toHaveBeenCalledWith(
        mockBidDto.auctionId,
        { currentPrice: mockBidDto.amount },
      );
      expect(mockBidsGateway.notifyPriceUpdate).toHaveBeenCalledWith(
        mockBidDto.auctionId,
        mockBidDto.amount,
      );
      expect(result).toEqual(expectedBid);
    });

    it('должен выбросить BadRequestException если аукцион завершен', async () => {
      const endedAuction = {
        ...mockAuction,
        endDate: new Date(Date.now() - 1000000),
      };

      mockAuctionRepository.findOne.mockResolvedValue(endedAuction);

      await expect(service.placeBid(mockBidDto, mockUserId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('должен выбросить BadRequestException если ставка меньше или равна текущей цене', async () => {
      const lowBidDto = {
        auctionId: 'test-auction-id',
        amount: 50,
        bidderId: 'test-bidder-id',
      };

      mockAuctionRepository.findOne.mockResolvedValue(mockAuction);

      await expect(service.placeBid(lowBidDto, mockUserId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getBidsForAuction', () => {
    it('должен вернуть список ставок для аукциона', async () => {
      const mockBids = [
        { id: 'bid-1', amount: 150 },
        { id: 'bid-2', amount: 120 },
      ];

      mockBidRepository.find.mockResolvedValue(mockBids);

      const result = await service.getBidsForAuction('test-auction-id');

      expect(mockBidRepository.find).toHaveBeenCalledWith({
        where: { auction: { id: 'test-auction-id' } },
        relations: ['bidder'],
        order: { amount: 'DESC' },
      });
      expect(result).toEqual(mockBids);
    });
  });
});
