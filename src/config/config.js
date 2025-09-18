// config/config.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    dialect:  'mysql',
    logging:  false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    dialect:  'mysql',
    logging:  false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    dialect:  'mysql',
    logging:  false,
  },
};
