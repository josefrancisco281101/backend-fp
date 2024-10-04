import { createPool } from "mysql2/promise";
import {
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_HOST,
  DB_DATABASE,
} from "./config.js";

export const pool = createPool({
  database: DB_DATABASE,
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  user: DB_USER,
});
