import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("wallets", (table) => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .unique();
    table.decimal("balance", 10, 2).notNullable().defaultTo(0.0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("wallets");
}
