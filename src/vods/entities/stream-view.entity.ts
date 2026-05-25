import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "stream_views" })
export class StreamViewEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "stream_id", type: "uuid" })
  streamId!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "watch_duration_seconds", type: "integer" })
  watchDurationSeconds!: number;

  @Column({ name: "watched_at", type: "timestamp" })
  watchedAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
