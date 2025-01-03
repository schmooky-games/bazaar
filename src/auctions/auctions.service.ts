import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto, AuctionFiltersDto } from './dto/auction.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BidsService } from '../bids/bids.service';
import { Auction, Bid } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { ClientKafka } from '@nestjs/microservices';
import { timestamp } from 'rxjs';

@Injectable()
export class AuctionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bidsService: BidsService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createAuction(
    dto: CreateAuctionDto,
    sellerId: string,
  ): Promise<Auction> {
    return this.prisma.auction.create({
      data: {
        id: createId(),
        ...dto,
        currentPrice: dto.startingPrice,
        sellerId,
      },
    });
  }

  async getAuctionById(id: string): Promise<Auction> {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
    });
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  async listAuctions(
    filters: AuctionFiltersDto,
    options: { page: number; limit: number },
  ): Promise<{
    items: any[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.minPrice) {
      where.currentPrice = { gte: filters.minPrice };
    }
    if (filters.maxPrice) {
      where.currentPrice = { lte: filters.maxPrice };
    }
    if (filters.searchTerm) {
      where.name = { contains: filters.searchTerm, mode: 'insensitive' };
    }
    if (filters.active !== undefined) {
      where.endDate = filters.active ? { gte: new Date() } : { lt: new Date() };
    }

    const [data, totalItems] = await Promise.all([
      this.prisma.auction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { endDate: 'asc' },
      }),
      this.prisma.auction.count({ where }),
    ]);

    return {
      items: data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async endAuction(id: string): Promise<Bid | null> {
    const auction = await this.getAuctionById(id);

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    await this.prisma.auction.update({
      where: { id },
      data: { endDate: new Date() },
    });

    const winningBid = await this.bidsService.getHighestBidsForAuction(id);

    await this.kafkaClient.emit('auction.end', {
      auctionId: id,
      endDate: new Date(),
      winningBid: winningBid,
    });

    return winningBid;
  }
}
