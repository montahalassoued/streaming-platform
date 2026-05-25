import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "user_bans" })
export class UserBanEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "banned_by", type: "uuid" })
  bannedBy!: string;

  @Column({ type: "text" })
  reason!: string;

  @Column({ name: "expires_at", type: "timestamp", nullable: true })
  expiresAt?: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
