import "dotenv/config";
import path from "path";
import { DataSource } from "typeorm";

const srcPath = process.cwd();

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [path.join(srcPath, "src", "**", "*.entity.{ts,js}")],
  migrations: [path.join(srcPath, "src", "migrations", "*.{ts,js}")],
});

export default dataSource;
