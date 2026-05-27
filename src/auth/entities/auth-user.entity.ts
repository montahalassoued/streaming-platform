import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "users" })
export class AuthUserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  username!: string;

  @Column({ type: "varchar" })
  email!: string;


  @Column({ name: "password_hash", type: "varchar" })
  passwordHash!: string;

  @Column({ name: "is_admin", type: "boolean", default: false })
  isAdmin!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
  updatedAt?: Date | null;
}
