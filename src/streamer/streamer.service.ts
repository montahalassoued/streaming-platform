import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StreamEntity } from "../streams/entities/stream.entity";
import { DonationEntity } from "../donations/entities/donation.entity";
import { StreamSubscriptionEntity } from "../streams/entities/stream-subscription.entity";
import { FollowEntity } from "../follows/entities/follow.entity";
import { ChatMessageEntity } from "../chat/entities/chat-message.entity";
import { StreamerEntity } from "./entities/streamer.entity";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class StreamerService {
  constructor(
    @InjectRepository(StreamEntity)
    private readonly streamRepo: Repository<StreamEntity>,
    @InjectRepository(DonationEntity)
    private readonly donationRepo: Repository<DonationEntity>,
    @InjectRepository(StreamSubscriptionEntity)
    private readonly subscriptionRepo: Repository<StreamSubscriptionEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepo: Repository<FollowEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatRepo: Repository<ChatMessageEntity>,
    @InjectRepository(StreamerEntity)
    private readonly streamerRepo: Repository<StreamerEntity>,
    private readonly redisService: RedisService,
  ) {}

  async getStreamerByUser(userId: string) {
    const streamer = await this.streamerRepo.findOneBy({ userId });
    if (!streamer) throw new NotFoundException("Streamer not found");
    return streamer;
  }

  async getDonationsReceived(userId: string, page = 1, limit = 20) {
    // find streams for streamer
    const streams = await this.streamRepo.findBy({
      streamerId: (await this.getStreamerByUser(userId)).id,
    });
    const streamIds = streams.map((s) => s.id);
    if (streamIds.length === 0)
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };

    const [items, total] = await this.donationRepo
      .createQueryBuilder("d")
      .where("d.stream_id IN (:...ids)", { ids: streamIds })
      .orderBy("d.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: total > page * limit,
        hasPrevPage: page > 1,
      },
    };
  }

  async getSubscribers(userId: string) {
    const streamer = await this.getStreamerByUser(userId);
    return this.followRepo.find({
      where: { streamerId: streamer.userId } as any,
      relations: ["follower"] as any,
    });
  }

  async updateChannelSettings(
    userId: string,
    dto: { channelDescription?: string; chatRules?: string },
  ) {
    const streamer = await this.getStreamerByUser(userId);
    if (dto.channelDescription !== undefined)
      streamer.bio = dto.channelDescription;
    await this.streamerRepo.save(streamer);
    // publish update event
    void this.redisService.publish("streamer.settings.updated", {
      streamerId: streamer.id,
    });
    return streamer;
  }

  async deleteChatMessage(streamerUserId: string, messageId: string) {
    const message = await this.chatRepo.findOneBy({ id: messageId });
    if (!message) throw new NotFoundException("Message not found");
    const stream = await this.streamRepo.findOneBy({ id: message.streamId });
    if (!stream) throw new NotFoundException("Stream not found");
    const streamer = await this.getStreamerByUser(streamerUserId);
    if (stream.streamerId !== streamer.id)
      throw new ForbiddenException("Not the owner");
    message.isDeleted = true;
    await this.chatRepo.save(message);
    void this.redisService.publish("chat.message.deleted", { messageId });
    return { ok: true };
  }
}
