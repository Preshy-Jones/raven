import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned() 
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.enum("type", ["DEPOSIT", "TRANSFER"]).notNullable();
    table.decimal("amount", 10, 2).notNullable();
    table.enum("status", ["PENDING", "COMPLETED", "FAILED"]).notNullable();
    table.string("reference").unique().notNullable();
    table.json("metadata");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("transactions");
}
