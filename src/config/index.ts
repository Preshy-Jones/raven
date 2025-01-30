const joi = require("joi");
require("dotenv").config();

const envVarsSchema = joi
  .object({
    NODE_ENV: joi.string().default("development"),
    DB_HOST: joi
      .string()
      .required()
      .description("Database host name is required"),
    DB_USER: joi
      .string()
      .required()
      .description("Database username is required"),

    // DB_PASSWORD: joi
    //   .string()
    //   // .required()
    //   .description("Database password is required"),
    DB_NAME: joi.string().required().description("Database name is required"),
    RAVEN_API_KEY: joi
      .string()
      .required()
      .description("Raven API key is required"),
    RAVEN_WEBHOOK_SECRET: joi.string().description("Raven webhook secret"),
    JWT_SECRET: joi
      .string()
      .required()
      .description("JWT secret key is required"),
    JWT_EXPIRES_IN: joi
      .string()
      .required()
      .description("JWT expiry time is required"),
  })
  .unknown()
  .required();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: {
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
    isTest: process.env.NODE_ENV === "test",
  },

  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  raven: {
    apiKey: envVars.RAVEN_API_KEY,
    webhookSecret: envVars.RAVEN_WEBHOOK_SECRET,
  },
};

export default config;
