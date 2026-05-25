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

  @Column({ name: "tier_id", type: "uuid" })
  tierId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
