import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "streamers" })
export class StreamerEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ type: "text", nullable: true })
  bio?: string | null;

  @Column({ name: "stream_key", type: "varchar" })
  streamKey!: string;

  @Column({ name: "is_verified", type: "boolean", default: false })
  isVerified!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
