const { Pool, types } = require("pg");
const env = require("./env");

types.setTypeParser(20, (value) => Number(value)); // int8 / BIGINT
types.setTypeParser(21, (value) => Number(value)); // int2 / SMALLINT
types.setTypeParser(23, (value) => Number(value)); // int4 / INTEGER

const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { pgPool };
