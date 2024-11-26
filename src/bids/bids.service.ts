import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { PlaceBidDto } from './dto/bid.dto';
import { AuctionsService } from '../auctions/auctions.service';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    private auctionService: AuctionsService,
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

    auction.currentPrice = dto.amount;
    await this.auctionService.createAuction(auction, auction.seller.id);

    return bid;
  }

  async getBidsForAuction(auctionId: string): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { auction: { id: auctionId } },
      relations: ['bidder'],
      order: { amount: 'DESC' },
    });
  }
}
