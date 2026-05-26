import dataSource from "../data-source";
import { UserEntity } from "../users/entities/user.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";
import { CategoryEntity } from "../categories/entities/category.entity";
import { SubscriptionTierEntity } from "../subscription-tiers/entities/subscription-tier.entity";
import { StreamEntity } from "../streams/entities/stream.entity";
import { VodEntity } from "../vods/entities/vod.entity";
import { ChatMessageEntity } from "../chat/entities/chat-message.entity";
import { DonationEntity } from "../donations/entities/donation.entity";
import { StreamViewEntity } from "../vods/entities/stream-view.entity";
import { VodViewEntity } from "../vods/entities/vod-view.entity";
import * as bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

async function findOrCreate(
  repo: any,
  where: any,
  createObj: Record<string, any>,
): Promise<any> {
  const found = await repo.findOne({ where });
  if (found) return found;
  // cast to any to avoid TypeScript complaining about unknown properties
  const entity = repo.create(createObj as any);
  return repo.save(entity as any);
}

async function run() {
  try {
    const ds = await dataSource.initialize();
    console.log("DataSource initialized for full seed...");

    const userRepo = ds.getRepository(UserEntity);
    const streamerRepo = ds.getRepository(StreamerEntity);
    const categoryRepo = ds.getRepository(CategoryEntity);
    const tierRepo = ds.getRepository(SubscriptionTierEntity);
    const streamRepo = ds.getRepository(StreamEntity);
    const vodRepo = ds.getRepository(VodEntity);
    const chatRepo = ds.getRepository(ChatMessageEntity);
    const donationRepo = ds.getRepository(DonationEntity);
    const streamViewRepo = ds.getRepository(StreamViewEntity);
    const vodViewRepo = ds.getRepository(VodViewEntity);

    // Users
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const admin = await findOrCreate(
      userRepo,
      { email: process.env.ADMIN_EMAIL ?? "admin@example.com" },
      {
        username: "admin",
        email: process.env.ADMIN_EMAIL ?? "admin@example.com",
        passwordHash: adminHash,
        isAdmin: true,
      },
    );

    const aliceHash = await bcrypt.hash("alicepass", 10);
    const alice = await findOrCreate(
      userRepo,
      { email: "alice@example.com" },
      {
        username: "alice",
        email: "alice@example.com",
        passwordHash: aliceHash,
      },
    );

    const bobHash = await bcrypt.hash("bobpass", 10);
    const bob = await findOrCreate(
      userRepo,
      { email: "bob@example.com" },
      {
        username: "bob",
        email: "bob@example.com",
        passwordHash: bobHash,
      },
    );

    // Streamers
    const aliceStreamer = await findOrCreate(
      streamerRepo,
      { userId: alice.id },
      {
        userId: alice.id,
        bio: "Streamer Alice",
        streamKey: randomUUID(),
        isVerified: true,
      },
    );

    const bobStreamer = await findOrCreate(
      streamerRepo,
      { userId: bob.id },
      {
        userId: bob.id,
        bio: "Streamer Bob",
        streamKey: randomUUID(),
        isVerified: false,
      },
    );

    // Categories
    const gaming = await findOrCreate(
      categoryRepo,
      { slug: "gamers" },
      {
        name: "Gamers",
        slug: "gamers",
        thumbnailUrl: "",
      },
    );

    const music = await findOrCreate(
      categoryRepo,
      { slug: "music" },
      {
        name: "Music",
        slug: "music",
        thumbnailUrl: "",
      },
    );

    // Subscription tiers
    const bronze = await findOrCreate(
      tierRepo,
      { name: "Bronze" },
      {
        name: "Bronze",
        priceCents: 499,
        description: "Basic support tier",
      },
    );

    const silver = await findOrCreate(
      tierRepo,
      { name: "Silver" },
      {
        name: "Silver",
        priceCents: 999,
        description: "Extra perks",
      },
    );

    // Streams
    const aliceStream = await findOrCreate(
      streamRepo,
      { title: "Alice Live" },
      {
        streamerId: aliceStreamer.id,
        categoryId: gaming.id,
        title: "Alice Live",
        rtmpUrl: "rtmp://example/alice",
        hlsUrl: "https://example/hls/alice.m3u8",
        isLive: true,
        startedAt: new Date(),
      },
    );

    const bobStream = await findOrCreate(
      streamRepo,
      { title: "Bob Chill" },
      {
        streamerId: bobStreamer.id,
        categoryId: music.id,
        title: "Bob Chill",
        rtmpUrl: "rtmp://example/bob",
        hlsUrl: "https://example/hls/bob.m3u8",
        isLive: false,
      },
    );

    // VODs
    const aliceVod = await findOrCreate(
      vodRepo,
      { title: "Alice VOD 1" },
      {
        streamId: aliceStream.id,
        title: "Alice VOD 1",
        videoUrl: "https://cdn.example/alice/vod1.mp4",
        thumbnailUrl: "https://cdn.example/alice/vod1.jpg",
        durationSeconds: 3600,
        isPublic: true,
      },
    );

    // Chat messages
    await findOrCreate(
      chatRepo,
      { content: "Hello everyone", userId: bob.id },
      {
        streamId: aliceStream.id,
        userId: bob.id,
        content: "Hello everyone",
      },
    );

    // Donations
    await findOrCreate(
      donationRepo,
      { userId: bob.id, amountCents: 500 },
      {
        streamId: aliceStream.id,
        userId: bob.id,
        amountCents: 500,
        currency: "USD",
        message: "Great stream!",
        status: "completed",
      },
    );

    // Views
    await findOrCreate(
      streamViewRepo,
      { streamId: aliceStream.id, userId: bob.id },
      {
        streamId: aliceStream.id,
        userId: bob.id,
        watchDurationSeconds: 120,
        watchedAt: new Date(),
      },
    );

    await findOrCreate(
      vodViewRepo,
      { vodId: aliceVod.id, userId: bob.id },
      {
        vodId: aliceVod.id,
        userId: bob.id,
        watchDurationSeconds: 1800,
        watchedAt: new Date(),
      },
    );

    console.log("Seeding completed.");
    await ds.destroy();
    process.exit(0);
  } catch (err) {
    console.error("Full seeding failed:", err);
    process.exit(1);
  }
}

void run();
