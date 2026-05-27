import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Index("follows_streamer_id_idx", ["streamerId"])
@Entity({ name: "follows" })
export class FollowEntity {
  @PrimaryColumn({ name: "follower_id", type: "uuid" })
  followerId!: string;

  @PrimaryColumn({ name: "streamer_id", type: "uuid" })
  streamerId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "follower_id" })
  follower?: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "streamer_id" })
  streamer?: UserEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deletedAt?: Date | null;
}
