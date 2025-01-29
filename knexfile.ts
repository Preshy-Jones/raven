import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "raven",
    },
    migrations: {
      directory: "./src/database/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },
};

export default config;
