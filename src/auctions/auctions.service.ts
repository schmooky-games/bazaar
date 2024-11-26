import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { CreateAuctionDto, AuctionFiltersDto } from './dto/auction.dto';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
  ) {}

  async createAuction(dto: CreateAuctionDto, userId: string): Promise<Auction> {
    const auction = this.auctionRepository.create({
      ...dto,
      currentPrice: dto.startingPrice,
      seller: { id: userId },
    });
    return this.auctionRepository.save(auction);
  }

  async getAuctionById(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  async listAuctions(filters: AuctionFiltersDto): Promise<Auction[]> {
    const where: any = {};

    if (filters.minPrice) {
      where.currentPrice = MoreThanOrEqual(filters.minPrice);
    }
    if (filters.maxPrice) {
      where.currentPrice = LessThanOrEqual(filters.maxPrice);
    }
    if (filters.searchTerm) {
      where.name = Like(`%${filters.searchTerm}%`);
    }
    if (filters.active !== undefined) {
      where.endDate = filters.active
        ? MoreThanOrEqual(new Date())
        : LessThanOrEqual(new Date());
    }

    return this.auctionRepository.find({
      where,
      relations: ['seller'],
    });
  }

  async endAuction(id: string): Promise<void> {
    const auction = await this.getAuctionById(id);
    auction.endDate = new Date();
    await this.auctionRepository.save(auction);
  }
}
