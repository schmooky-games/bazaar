import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { PlaceBidDto } from './dto/bid.dto';
import { createId } from '@paralleldrive/cuid2';
import { Auction } from '../auctions/entities/auction.entity';
import { BidsGateway } from '../websockets/bids.gateway';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private readonly bidRepository: Repository<Bid>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    private readonly bidsGateway: BidsGateway,
  ) {}

  private async validateAuction(auctionId: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
      relations: ['seller'],
    });
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  async placeBid(dto: PlaceBidDto, userId: string): Promise<Bid> {
    const auction = await this.validateAuction(dto.auctionId);

    if (auction.endDate < new Date()) {
      throw new BadRequestException('Auction has ended');
    }

    if (dto.amount <= auction.currentPrice) {
      throw new BadRequestException('Bid must be higher than current price');
    }

    const bid = this.bidRepository.create({
      id: createId(),
      amount: dto.amount,
      placedAt: new Date(),
      auction: { id: dto.auctionId },
      bidder: { id: userId },
    });

    await this.bidRepository.save(bid);

    await this.auctionRepository.update(dto.auctionId, {
      currentPrice: dto.amount,
    });

    if (auction.endDate <= new Date()) {
      await this.auctionRepository.save(auction);
    }

    await this.bidsGateway.notifyPriceUpdate(dto.auctionId, dto.amount);

    return bid;
  }

  async getBidsForUser(
    userId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Bid>> {
    const queryBuilder = this.bidRepository
      .createQueryBuilder('bid')
      .where('bid.bidderId = :userId', { userId })
      .orderBy('bid.placedAt', 'DESC');

    return paginate<Bid>(queryBuilder, options);
  }

  async getBidsForAuction(auctionId: string): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { auction: { id: auctionId } },
      relations: ['bidder'],
      order: { amount: 'DESC' },
    });
  }

  async getHighestBidsForAuction(auctionId: string): Promise<Bid> {
    return this.bidRepository.findOne({
      where: { auction: { id: auctionId } },
      relations: ['bidder'],
      order: { amount: 'DESC' },
    });
  }
}
