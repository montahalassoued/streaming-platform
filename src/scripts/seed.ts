import dataSource from "../data-source";
import { UserEntity } from "../users/entities/user.entity";
import { StreamerEntity } from "../streamer/entities/streamer.entity";
import { CategoryEntity } from "../categories/entities/category.entity";
import { StreamEntity } from "../streams/entities/stream.entity";
import { VodEntity } from "../vods/entities/vod.entity";
import { ChatMessageEntity } from "../chat/entities/chat-message.entity";
import { DonationEntity } from "../donations/entities/donation.entity";
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
    // subscription tiers table removed; skip tier seeding
    const tierRepo = null;
    const streamRepo = ds.getRepository(StreamEntity);
    const vodRepo = ds.getRepository(VodEntity);
    const chatRepo = ds.getRepository(ChatMessageEntity);
    const donationRepo = ds.getRepository(DonationEntity);
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

    const charlieHash = await bcrypt.hash("charliepass", 10);
    const charlie = await findOrCreate(
      userRepo,
      { email: "charlie@example.com" },
      {
        username: "charlie",
        email: "charlie@example.com",
        passwordHash: charlieHash,
      },
    );

    const dianaHash = await bcrypt.hash("dianapass", 10);
    const diana = await findOrCreate(
      userRepo,
      { email: "diana@example.com" },
      {
        username: "diana",
        email: "diana@example.com",
        passwordHash: dianaHash,
      },
    );

    const elenaHash = await bcrypt.hash("elenapass", 10);
    const elena = await findOrCreate(
      userRepo,
      { email: "elena@example.com" },
      {
        username: "elena",
        email: "elena@example.com",
        passwordHash: elenaHash,
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

    const art = await findOrCreate(
      categoryRepo,
      { slug: "art" },
      {
        name: "Art",
        slug: "art",
        thumbnailUrl: "",
      },
    );

    const tech = await findOrCreate(
      categoryRepo,
      { slug: "tech" },
      {
        name: "Tech",
        slug: "tech",
        thumbnailUrl: "",
      },
    );

    // subscription tiers removed; no tiers to seed

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

    const charlieStreamer = await findOrCreate(
      streamerRepo,
      { userId: charlie.id },
      {
        userId: charlie.id,
        bio: "Streamer Charlie",
        streamKey: randomUUID(),
        isVerified: false,
      },
    );

    const dianaStreamer = await findOrCreate(
      streamerRepo,
      { userId: diana.id },
      {
        userId: diana.id,
        bio: "Streamer Diana",
        streamKey: randomUUID(),
        isVerified: true,
      },
    );

    const elenaStreamer = await findOrCreate(
      streamerRepo,
      { userId: elena.id },
      {
        userId: elena.id,
        bio: "Streamer Elena",
        streamKey: randomUUID(),
        isVerified: true,
      },
    );

    const charlieStream = await findOrCreate(
      streamRepo,
      { title: "Charlie Coding Live" },
      {
        streamerId: charlieStreamer.id,
        categoryId: tech.id,
        title: "Charlie Coding Live",
        rtmpUrl: "rtmp://example/charlie",
        hlsUrl: "https://example/hls/charlie.m3u8",
        isLive: true,
        startedAt: new Date(),
      },
    );

    const dianaStream = await findOrCreate(
      streamRepo,
      { title: "Diana Art Corner" },
      {
        streamerId: dianaStreamer.id,
        categoryId: art.id,
        title: "Diana Art Corner",
        rtmpUrl: "rtmp://example/diana",
        hlsUrl: "https://example/hls/diana.m3u8",
        isLive: false,
      },
    );

    const elenaStream = await findOrCreate(
      streamRepo,
      { title: "Elena Tech Talks" },
      {
        streamerId: elenaStreamer.id,
        categoryId: tech.id,
        title: "Elena Tech Talks",
        rtmpUrl: "rtmp://example/elena",
        hlsUrl: "https://example/hls/elena.m3u8",
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
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://picsum.photos/seed/alice-vod-1/1280/720",
        durationSeconds: 596,
        isPublic: true,
      },
    );

    const aliceVod2 = await findOrCreate(
      vodRepo,
      { title: "Alice VOD 2" },
      {
        streamId: aliceStream.id,
        title: "Alice VOD 2",
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://picsum.photos/seed/alice-vod-2/1280/720",
        durationSeconds: 653,
        isPublic: true,
      },
    );

    const bobVod = await findOrCreate(
      vodRepo,
      { title: "Bob Chill Session" },
      {
        streamId: bobStream.id,
        title: "Bob Chill Session",
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnailUrl: "https://picsum.photos/seed/bob-vod-1/1280/720",
        durationSeconds: 522,
        isPublic: true,
      },
    );

    const charlieVod = await findOrCreate(
      vodRepo,
      { title: "Charlie Coding Highlights" },
      {
        streamId: charlieStream.id,
        title: "Charlie Coding Highlights",
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        thumbnailUrl: "https://picsum.photos/seed/charlie-vod-1/1280/720",
        durationSeconds: 888,
        isPublic: true,
      },
    );

    const charlieVod2 = await findOrCreate(
      vodRepo,
      { title: "Charlie Live Q&A" },
      {
        streamId: charlieStream.id,
        title: "Charlie Live Q&A",
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        thumbnailUrl: "https://picsum.photos/seed/charlie-vod-2/1280/720",
        durationSeconds: 1024,
        isPublic: true,
      },
    );

    const dianaVod = await findOrCreate(
      vodRepo,
      { title: "Diana Sketch Session" },
      {
        streamId: dianaStream.id,
        title: "Diana Sketch Session",
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://picsum.photos/seed/diana-vod-1/1280/720",
        durationSeconds: 710,
        isPublic: true,
      },
    );

    const dianaVod2 = await findOrCreate(
      vodRepo,
      { title: "Diana Art Walkthrough" },
      {
        streamId: dianaStream.id,
        title: "Diana Art Walkthrough",
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnailUrl: "https://picsum.photos/seed/diana-vod-2/1280/720",
        durationSeconds: 540,
        isPublic: true,
      },
    );

    const elenaVod = await findOrCreate(
      vodRepo,
      { title: "Elena Tech Deep Dive" },
      {
        streamId: elenaStream.id,
        title: "Elena Tech Deep Dive",
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://picsum.photos/seed/elena-vod-1/1280/720",
        durationSeconds: 1260,
        isPublic: true,
      },
    );

    const elenaVod2 = await findOrCreate(
      vodRepo,
      { title: "Elena Product Demo" },
      {
        streamId: elenaStream.id,
        title: "Elena Product Demo",
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://picsum.photos/seed/elena-vod-2/1280/720",
        durationSeconds: 930,
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
      vodViewRepo,
      { vodId: aliceVod.id, userId: bob.id },
      {
        vodId: aliceVod.id,
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

    await findOrCreate(
      vodViewRepo,
      { vodId: aliceVod2.id, userId: admin.id },
      {
        vodId: aliceVod2.id,
        userId: admin.id,
        watchDurationSeconds: 1200,
        watchedAt: new Date(),
      },
    );

    await findOrCreate(
      vodViewRepo,
      { vodId: bobVod.id, userId: alice.id },
      {
        vodId: bobVod.id,
        userId: alice.id,
        watchDurationSeconds: 900,
        watchedAt: new Date(),
      },
    );

    await findOrCreate(
      vodViewRepo,
      { vodId: charlieVod.id, userId: bob.id },
      {
        vodId: charlieVod.id,
        userId: bob.id,
        watchDurationSeconds: 1400,
        watchedAt: new Date(),
      },
    );

    await findOrCreate(
      vodViewRepo,
      { vodId: charlieVod2.id, userId: admin.id },
      {
        vodId: charlieVod2.id,
        userId: admin.id,
        watchDurationSeconds: 800,
        watchedAt: new Date(),
      },
    );

    await findOrCreate(
      vodViewRepo,
      { vodId: dianaVod.id, userId: bob.id },
      {
        vodId: dianaVod.id,
        userId: bob.id,
        watchDurationSeconds: 620,
        watchedAt: new Date(),
      },
    );

    await findOrCreate(
      vodViewRepo,
      { vodId: dianaVod2.id, userId: alice.id },
      {
        vodId: dianaVod2.id,
        userId: alice.id,
        watchDurationSeconds: 500,
        watchedAt: new Date(),
      },
    );

    await findOrCreate(
      vodViewRepo,
      { vodId: elenaVod.id, userId: bob.id },
      {
        vodId: elenaVod.id,
        userId: bob.id,
        watchDurationSeconds: 1100,
        watchedAt: new Date(),
      },
    );

    await findOrCreate(
      vodViewRepo,
      { vodId: elenaVod2.id, userId: alice.id },
      {
        vodId: elenaVod2.id,
        userId: alice.id,
        watchDurationSeconds: 760,
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
