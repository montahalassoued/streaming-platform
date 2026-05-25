import dataSource from "../data-source";

async function run() {
  try {
    const ds = await dataSource.initialize();
    console.log("DataSource initialized. Synchronizing schema...");
    await ds.synchronize();
    console.log("Schema synchronized successfully.");
    await ds.destroy();
    process.exit(0);
  } catch (err) {
    console.error("Schema synchronization failed:", err);
    process.exit(1);
  }
}

void run();
