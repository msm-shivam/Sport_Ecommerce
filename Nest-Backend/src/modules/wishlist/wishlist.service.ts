import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(WishlistItem)
    private readonly wishlistItemRepository: Repository<WishlistItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getOrCreate(userId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistRepository.findOne({
      where: { userId },
      relations: { items: { product: true } },
    });
    if (!wishlist) {
      wishlist = this.wishlistRepository.create({ userId });
      wishlist = await this.wishlistRepository.save(wishlist);
      wishlist.items = [];
    }
    return wishlist;
  }

  async addProduct(userId: string, productId: string): Promise<Wishlist> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const wishlist = await this.getOrCreate(userId);
    const existing = wishlist.items?.find((i) => i.productId === productId);
    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }
    const item = this.wishlistItemRepository.create({ wishlistId: wishlist.id, productId });
    await this.wishlistItemRepository.save(item);
    return this.getOrCreate(userId);
  }

  async removeProduct(userId: string, productId: string): Promise<Wishlist> {
    const wishlist = await this.getOrCreate(userId);
    const item = wishlist.items?.find((i) => i.productId === productId);
    if (!item) {
      throw new NotFoundException('Product not in wishlist');
    }
    await this.wishlistItemRepository.remove(item);
    return this.getOrCreate(userId);
  }
}
