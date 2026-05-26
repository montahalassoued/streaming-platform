import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import { FollowEntity } from "../follows/entities/follow.entity";
import { DonationEntity } from "../donations/entities/donation.entity";
import { StreamSubscriptionEntity } from "../streams/entities/stream-subscription.entity";
import { SubscriptionTierEntity } from "../subscription-tiers/entities/subscription-tier.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepo: Repository<
      import("../follows/entities/follow.entity").FollowEntity
    >,
    @InjectRepository(DonationEntity)
    private readonly donationRepo: Repository<
      import("../donations/entities/donation.entity").DonationEntity
    >,
    @InjectRepository(StreamSubscriptionEntity)
    private readonly subscriptionRepo: Repository<
      import("../streams/entities/stream-subscription.entity").StreamSubscriptionEntity
    >,
    @InjectRepository(SubscriptionTierEntity)
    private readonly tierRepo: Repository<
      import("../subscription-tiers/entities/subscription-tier.entity").SubscriptionTierEntity
    >,
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

  /* Follow / Unfollow */
  async follow(followerId: string, streamerId: string) {
    const existing = await this.followRepo.findOneBy({
      followerId,
      streamerId,
    });
    if (existing) return existing;
    const follow = this.followRepo.create({ followerId, streamerId });
    return this.followRepo.save(follow);
  }

  async unfollow(followerId: string, streamerId: string) {
    const existing = await this.followRepo.findOneBy({
      followerId,
      streamerId,
    });
    if (!existing) return null;
    await this.followRepo.remove(existing);
    return existing;
  }

  /* Donations */
  async giveDonation(
    createDonationDto: Partial<
      import("../donations/entities/donation.entity").DonationEntity
    >,
  ) {
    const donation = this.donationRepo.create({
      streamId: createDonationDto.streamId!,
      userId: createDonationDto.userId!,
      amountCents: createDonationDto.amountCents ?? 0,
      currency: createDonationDto.currency ?? "USD",
      message: createDonationDto.message ?? null,
      status: createDonationDto.status ?? "completed",
    });
    return this.donationRepo.save(donation);
  }

  /* Subscriptions */
  async subscribeToStreamer(
    userId: string,
    streamerId: string,
    tierId: string,
  ) {
    // Optionally verify tier exists
    const tier = await this.tierRepo.findOneBy({ id: tierId });
    if (!tier) throw new Error("Subscription tier not found");

    const existing = await this.subscriptionRepo.findOneBy({
      userId,
      streamerId,
      tierId,
    });
    if (existing) return existing;

    const sub = this.subscriptionRepo.create({ userId, streamerId, tierId });
    return this.subscriptionRepo.save(sub);
  }
}
