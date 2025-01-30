import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("virtual_accounts", (table) => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("accountNumber").notNullable();
    table.string("accountName").notNullable();
    table.string("bankName").notNullable();
    table.decimal("amount", 10, 2).notNullable();
    table.enum("status", ["ACTIVE", "INACTIVE"]).defaultTo("ACTIVE");
    table.timestamps(true, true);

    // Composite unique constraint for account details
    table.unique(["userId", "accountNumber"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("virtual_accounts");
}
