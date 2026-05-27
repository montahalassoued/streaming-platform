import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type DonationStatus = "pending" | "completed" | "failed" | "refunded";

@Entity({ name: "donations" })
export class DonationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "stream_id", type: "uuid" })
  streamId!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "amount_cents", type: "integer" })
  amountCents!: number;

  @Column({ type: "varchar" })
  currency!: string;

  @Column({ type: "text", nullable: true })
  message?: string | null;

  @Column({ name: "provider_payment_id", type: "varchar", nullable: true })
  providerPaymentId?: string | null;

  @Column({ type: "varchar", default: "pending" })
  status!: DonationStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}
