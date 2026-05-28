import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CategoryEntity } from "../../categories/entities/category.entity";
import { StreamerEntity } from "../../streamer/entities/streamer.entity";

@Entity({ name: "streams" })
export class StreamEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "streamer_id", type: "uuid" })
  streamerId!: string;

  @ManyToOne(() => StreamerEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "streamer_id" })
  streamer?: StreamerEntity;

  @Column({ name: "category_id", type: "uuid", nullable: true })
  categoryId?: string | null;

  @ManyToOne(() => CategoryEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "category_id" })
  category?: CategoryEntity | null;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ name: "rtmp_url", type: "varchar" })
  rtmpUrl!: string;

  @Column({ name: "hls_url", type: "varchar" })
  hlsUrl!: string;

  @Column({ name: "is_live", type: "boolean", default: false })
  isLive!: boolean;

  @Column({ name: "started_at", type: "timestamp", nullable: true })
  startedAt?: Date | null;

  @Column({ name: "ended_at", type: "timestamp", nullable: true })
  endedAt?: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
