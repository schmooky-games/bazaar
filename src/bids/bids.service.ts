import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlaceBidDto } from './dto/bid.dto';
import { PaginationOptionsDto } from 'src/pagination/pagination.dto';
import { createId } from '@paralleldrive/cuid2';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class BidsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  private async validateAuction(auctionId: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
    });
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  async onModuleInit() {
    try {
      await this.kafkaClient.connect();
    } catch (error) {
      console.error('Failed to connect to Kafka:', error);
    }
  }

  async placeBid(dto: PlaceBidDto, userId: string) {
    const auction = await this.validateAuction(dto.auctionId);

    if (auction.endDate < new Date()) {
      throw new BadRequestException('Auction has ended');
    }

    if (dto.amount <= auction.currentPrice) {
      throw new BadRequestException('Bid must be higher than current price');
    }

    const bid = await this.prisma.bid.create({
      data: {
        id: createId(),
        amount: dto.amount,
        placedAt: new Date(),
        auctionId: dto.auctionId,
        bidderId: userId,
      },
    });

    await this.prisma.auction.update({
      where: { id: dto.auctionId },
      data: { currentPrice: dto.amount },
    });

    await this.kafkaClient.emit('auction.price.update', {
      auctionId: dto.auctionId,
      bidderId: userId,
      newPrice: dto.amount,
      timestamp: new Date(),
    });

    return bid;
  }

  async getBidsForUser(userId: string, options: PaginationOptionsDto) {
    const { skip, take } = options;

    const bids = await this.prisma.bid.findMany({
      where: { bidderId: userId },
      orderBy: { placedAt: 'desc' },
      skip,
      take,
    });

    const total = await this.prisma.bid.count({
      where: { bidderId: userId },
    });

    return { items: bids, total, skip, take };
  }

  async getBidsForAuction(auctionId: string) {
    return this.prisma.bid.findMany({
      where: { auctionId },
      orderBy: { amount: 'desc' },
    });
  }

  async getHighestBidsForAuction(auctionId: string) {
    return this.prisma.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'desc' },
    });
  }
}
