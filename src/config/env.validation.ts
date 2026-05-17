import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),

  DB_PORT: Joi.number().default(5432),

  DB_USERNAME: Joi.string().required(),

  DB_PASSWORD: Joi.string().allow('').required(),

  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().default('super-secret-jwt-key'),

  STELLAR_NETWORK: Joi.string().valid('TESTNET', 'PUBLIC').default('TESTNET'),

  AUTH_HOME_DOMAIN: Joi.string().default('keyguard.org'),

  STELLAR_SERVER_PRIVATE_KEY: Joi.string().default(
    'SAWSX2GDIONPN7WLUHKFLJPIMWGHG7OB4VKBHT6YACNZDKL2QHB2Y5ZX',
  ),
});