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
  ) {
    // verify streamer exists (expecting streamerId to be streamer.userId or streamer.id)
    // try to find by id first, then by userId
    let streamer = await this.streamerRepo.findOneBy({ id: streamerId });
    if (!streamer)
      streamer = await this.streamerRepo.findOneBy({ userId: streamerId });
    if (!streamer) throw new NotFoundException("Streamer not found");

    const existing = await this.subscriptionRepo.findOne({
      where: { userId, streamerId },
    });

    const now = new Date();
    const baseDate = existing?.expiresAt && existing.expiresAt > now ? existing.expiresAt : now;
    const expires = this.addOneMonth(baseDate);

    if (existing) {
      existing.streamerId = streamer.id;
      existing.expiresAt = expires;
      return this.subscriptionRepo.save(existing);
    }

    const sub = this.subscriptionRepo.create({
      userId,
      streamerId: streamer.id,
      expiresAt: expires,
    });
    return this.subscriptionRepo.save(sub);
  }

  private addOneMonth(date: Date) {
    const next = new Date(date);
    next.setMonth(next.getMonth() + 1);
    return next;
  }

  async getUserSubscriptions(userId: string) {
    return this.subscriptionRepo.findBy({ userId });
  }
}
