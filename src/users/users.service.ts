import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import { FollowEntity } from "../follows/entities/follow.entity";
import { DonationEntity } from "../donations/entities/donation.entity";
import { StreamSubscriptionEntity } from "../streams/entities/stream-subscription.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepo: Repository<FollowEntity>,
    @InjectRepository(DonationEntity)
    private readonly donationRepo: Repository<DonationEntity>,
    @InjectRepository(StreamSubscriptionEntity)
    private readonly subscriptionRepo: Repository<StreamSubscriptionEntity>,
    @InjectRepository(StreamerEntity)
    private readonly streamerRepo: Repository<StreamerEntity>,
  ) {}

  async findAll() {
    const users = await this.usersRepo.find();
    return users.map(({ passwordHash, ...user }) => user);
  }

  async findOne(id: string) {
    return (await this.usersRepo.findOneBy({ id })) ?? null;
  }

  async findByEmail(email: string) {
    return (await this.usersRepo.findOneBy({ email })) ?? null;
  }

  async findByUsername(username: string) {
    return (await this.usersRepo.findOneBy({ username })) ?? null;
  }

  async findByIdOrThrow(id: string) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async findByUsernameOrThrow(username: string) {
    const user = await this.usersRepo.findOneBy({ username });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getProfile(username: string) {
    const user = await this.findByUsernameOrThrow(username);
    const followerCount = await this.followRepo.countBy({
      streamerId: user.id,
    });
    const followingCount = await this.followRepo.countBy({
      followerId: user.id,
    });
    const isStreamer = !!(await this.streamerRepo.findOneBy({ userId: user.id }));
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      isStreamer,
      createdAt: user.createdAt,
      followerCount,
      followingCount,
    };
  }

  async updateProfile(userId: string, partial: { name?: string }) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("User not found");
    if (partial.name !== undefined) user.name = partial.name as any;
    return this.usersRepo.save(user);
  }

  async becomeStreamer(userId: string) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("User not found");
    const existing = await this.streamerRepo.findOneBy({ userId });
    if (!existing) {
      const s = this.streamerRepo.create({ userId, streamKey: require("crypto").randomBytes(16).toString("hex") } as any);
      await this.streamerRepo.save(s);
    }
    user.isStreamer = true;
    await this.usersRepo.save(user);
    return { ok: true };
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepo.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
      name: createUserDto.name,
      isAdmin: false,
    });

    return this.usersRepo.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) return null;

    if (updateUserDto.username !== undefined)
      user.username = updateUserDto.username;
    if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    if (updateUserDto.passwordHash !== undefined)
      user.passwordHash = updateUserDto.passwordHash;
    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.isAdmin !== undefined)
      user.isAdmin = updateUserDto.isAdmin;

    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) return null;
    await this.usersRepo.remove(user);
    return user;
  }
}
