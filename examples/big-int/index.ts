import { Generated, Kysely, PostgresDialect, sql, ColumnType } from "kysely";
import { Pool, types as pgTypes } from "pg";

pgTypes.setTypeParser(pgTypes.builtins.INT8, function (val) {
  return parseInt(val, 10);
});

export type Int8 = ColumnType<number, number | string, number | string>;

interface TestBigIntTable {
  id: Generated<Int8>;
  test_bigint: Int8 | null;
}

interface Database {
  test_big_int_table: TestBigIntTable;
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
    .createTable("test_big_int_table")
    .addColumn(
      "id",
      sql<string>`
            bigint GENERATED ALWAYS AS IDENTITY`,
      (col) => col.primaryKey()
    )
    .addColumn("test_bigint", "bigint")
    .execute();

  await db
    .insertInto("test_big_int_table")
    .values({ test_bigint: 123 })
    .execute();
  await db
    .insertInto("test_big_int_table")
    .values({ test_bigint: "8223372036854775807" })
    .execute();
  await db
    .insertInto("test_big_int_table")
    .values({ test_bigint: "223372036854775807" })
    .execute();
  await db
    .insertInto("test_big_int_table")
    .values({ test_bigint: 7223372036854775807 })
    .execute();
  const result = await db
    .selectFrom("test_big_int_table")
    .selectAll()
    .execute();
};

main().then(() => {
  console.log("Mischief Managed!");
});
