import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  username!: string;

  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  name?: string;

  @Column({ name: "password_hash", type: "varchar" })
  passwordHash!: string;

  @Column({ name: "is_email_verified", type: "boolean", default: false })
  isEmailVerified!: boolean;

  @Column({ name: "email_verified_at", type: "timestamp", nullable: true })
  emailVerifiedAt?: Date | null;

  @Column({ name: "refresh_token_hash", type: "varchar", nullable: true })
  refreshTokenHash?: string | null;

  @Column({ name: "refresh_token_expires_at", type: "timestamp", nullable: true })
  refreshTokenExpiresAt?: Date | null;

  @Column({ name: "is_admin", type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ name: "is_streamer", type: "boolean", default: false })
  isStreamer!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
  updatedAt?: Date | null;
}
