import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "vods" })
export class VodEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "stream_id", type: "uuid" })
  streamId!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ name: "video_url", type: "varchar" })
  videoUrl!: string;

  @Column({ name: "thumbnail_url", type: "varchar" })
  thumbnailUrl!: string;

  @Column({ name: "duration_seconds", type: "integer" })
  durationSeconds!: number;

  @Column({ name: "is_public", type: "boolean", default: false })
  isPublic!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
