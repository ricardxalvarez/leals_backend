import pg from 'pg'
import config from "../config/config.js";
const pool = new pg.Pool({
  host: config.psql.db_host,
  user: config.psql.db_user,
  database: config.psql.db_databse,
  password: config.psql.db_pass,
  port: config.psql.db_port,
});

export default pool