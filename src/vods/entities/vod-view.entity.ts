import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "vod_views" })
export class VodViewEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "vod_id", type: "uuid" })
  vodId!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "watch_duration_seconds", type: "integer" })
  watchDurationSeconds!: number;

  @Column({ name: "watched_at", type: "timestamp" })
  watchedAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
