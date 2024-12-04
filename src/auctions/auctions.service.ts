import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Auction } from './entities/auction.entity';
import { CreateAuctionDto, AuctionFiltersDto } from './dto/auction.dto';
import { BidsGateway } from '../websockets/bids.gateway';
import { BidsService } from '../bids/bids.service';
import { Bid } from '../bids/entities/bid.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    private bidsService: BidsService,
    private bidsGateway: BidsGateway,
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

  async listAuctions(
    filters: AuctionFiltersDto,
    options: IPaginationOptions,
  ): Promise<Pagination<Auction>> {
    const queryBuilder = this.auctionRepository.createQueryBuilder('auction');

    if (filters.minPrice) {
      queryBuilder.andWhere('auction.currentPrice >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }
    if (filters.maxPrice) {
      queryBuilder.andWhere('auction.currentPrice <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }
    if (filters.searchTerm) {
      queryBuilder.andWhere('auction.name LIKE :searchTerm', {
        searchTerm: `%${filters.searchTerm}%`,
      });
    }
    if (filters.active !== undefined) {
      if (filters.active) {
        queryBuilder.andWhere('auction.endDate >= :now', { now: new Date() });
      } else {
        queryBuilder.andWhere('auction.endDate < :now', { now: new Date() });
      }
    }

    queryBuilder.leftJoinAndSelect('auction.seller', 'seller');
    return paginate<Auction>(queryBuilder, options);
  }

  async endAuction(id: string): Promise<Bid> {
    const auction = await this.getAuctionById(id);
    const endDate = new Date();
    await this.auctionRepository.update(auction, { endDate: endDate });

    const winningBid = await this.bidsService.getHighestBidsForAuction(id);
    await this.bidsGateway.notifyAuctionEnd(id, winningBid);

    return winningBid;
  }
}
