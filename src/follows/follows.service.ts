import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FollowEntity } from "./entities/follow.entity";
import { UserEntity } from "../users/entities/user.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepo: Repository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(StreamerEntity)
    private readonly streamerRepo: Repository<StreamerEntity>,
  ) {}

  async follow(followerId: string, streamerId: string) {
    if (followerId === streamerId)
      throw new ConflictException("Cannot follow yourself");

    const streamer = await this.streamerRepo.findOneBy({ userId: streamerId });
    if (!streamer)
      throw new NotFoundException("Streamer not found");

    const follow = this.followRepo.create({ followerId, streamerId });
    try {
      return await this.followRepo.save(follow);
    } catch (err: any) {
      throw new ConflictException("Already following this streamer");
    }
  }

  async unfollow(followerId: string, streamerId: string) {
    const existing = await this.followRepo.findOneBy({
      followerId,
      streamerId,
    });
    if (!existing) throw new NotFoundException("Follow relationship not found");
    existing.deletedAt = new Date();
    await this.followRepo.save(existing);
    return existing;
  }

  async isFollowing(followerId: string, streamerId: string) {
    const q = await this.followRepo.findOne({
      where: { followerId, streamerId },
    });
    return !!q && q.deletedAt == null;
  }

  async getFollowers(streamerId: string) {
    return this.followRepo
      .find({
        where: { streamerId },
        relations: { follower: true },
        order: { createdAt: "DESC" },
        withDeleted: false,
      })
      .then((rows) => rows.filter((row) => row.deletedAt == null));
  }

  async getFollowing(followerId: string) {
    return this.followRepo
      .find({
        where: { followerId },
        relations: { streamer: true },
        order: { createdAt: "DESC" },
        withDeleted: false,
      })
      .then((rows) => rows.filter((row) => row.deletedAt == null));
  }

  async getFollowerIds(streamerId: string) {
    const rows = await this.followRepo
      .createQueryBuilder("f")
      .select(["f.followerId as id"])
      .where("f.streamerId = :streamerId", { streamerId })
      .andWhere("f.deleted_at IS NULL")
      .getRawMany();
    return rows.map((r) => r.id);
  }
}
