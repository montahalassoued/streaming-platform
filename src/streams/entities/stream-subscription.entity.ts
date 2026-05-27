import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "subscriptions" })
export class StreamSubscriptionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "streamer_id", type: "uuid" })
  streamerId!: string;

  @Column({ name: "tier_id", type: "uuid", nullable: true })
  tierId?: string | null;

  @Column({ name: "expires_at", type: "timestamp", nullable: true })
  expiresAt?: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
