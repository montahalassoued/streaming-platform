import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StreamSubscriptionEntity } from "../streams/entities/stream-subscription.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(StreamSubscriptionEntity)
    private readonly subscriptionRepo: Repository<StreamSubscriptionEntity>,
    @InjectRepository(StreamerEntity)
    private readonly streamerRepo: Repository<StreamerEntity>,
  ) {}

  async subscribeToStreamer(
    userId: string,
    streamerId: string,
    tierId?: string | null,
  ) {
    // verify streamer exists (expecting streamerId to be streamer.userId or streamer.id)
    // try to find by id first, then by userId
    let streamer = await this.streamerRepo.findOneBy({ id: streamerId } as any);
    if (!streamer)
      streamer = await this.streamerRepo.findOneBy({
        userId: streamerId,
      } as any);
    if (!streamer) throw new NotFoundException("Streamer not found");

    // tierId is accepted but tiers table was removed; ignore validation

    const existing = await this.subscriptionRepo.findOne({
      where: { userId, streamerId },
    });
    if (existing && existing.expiresAt && existing.expiresAt > new Date())
      return existing;

    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const sub = this.subscriptionRepo.create({
      userId,
      streamerId: streamer.id,
      tierId: tierId ?? null,
      expiresAt: expires,
    } as any);
    return this.subscriptionRepo.save(sub);
  }

  async getUserSubscriptions(userId: string) {
    return this.subscriptionRepo.findBy({ userId });
  }
}
