import { Generated, Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";

interface MyTable {
  id?: Generated<number>;
  name: string;
  last_updated: Date;
  last_updated_tz: Date;
}

interface Database {
  my_table: MyTable;
}

const main = async () => {
  const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "example",
    password: "<REDACTED>",
  });

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool,
    }),
  });

  // create the table if not exist
  await db.schema
    .createTable("my_table")
    .addColumn("name", "varchar(255)")
    .addColumn("last_updated", "timestamp", (col) =>
      col.defaultTo(sql`to_timestamp(0)`).notNull()
    )
    .addColumn("last_updated_tz", "timestamptz", (col) =>
      col.defaultTo(sql`to_timestamp(0)`).notNull()
    )
    .ifNotExists()
    .execute();

  // insert an example record to the table
  const now = new Date();
  const item = {
    name: "Timestamp example",
    last_updated: now,
    last_updated_tz: now,
  };

  await db.insertInto("my_table").values(item).execute();
};

main().then(() => {
  console.log("Mischief Managed!");
});
