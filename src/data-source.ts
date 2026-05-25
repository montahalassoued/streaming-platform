import "dotenv/config";
import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [__dirname + "/**/*.entity.{ts,js}"],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
});

export default dataSource;

// Also export for CLI compatibility
export { dataSource as DataSourceInstance };
