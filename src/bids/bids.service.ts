import { Injectable, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { PlaceBidDto } from './dto/bid.dto';
import { AuctionsService } from '../auctions/auctions.service';
import { createId } from '@paralleldrive/cuid2';
import { Auction } from 'src/auctions/entities/auction.entity';
import { BidsGateway } from 'src/websockets/bids.gateway';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private readonly bidRepository: Repository<Bid>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @Inject(forwardRef(() => AuctionsService))
    private readonly auctionService: AuctionsService,
    private readonly bidsGateway: BidsGateway,
  ) {}

  async placeBid(dto: PlaceBidDto, userId: string): Promise<Bid> {
    const auction = await this.auctionService.getAuctionById(dto.auctionId);

    if (auction.endDate < new Date()) {
      throw new BadRequestException('Auction has ended');
    }

    if (dto.amount <= auction.currentPrice) {
      throw new BadRequestException('Bid must be higher than current price');
    }

    const bid = this.bidRepository.create({
      id: createId(),
      amount: dto.amount,
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
