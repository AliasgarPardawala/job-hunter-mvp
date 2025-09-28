import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

const DB_PATH = path.resolve(__dirname, "../data/jobs.db");
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export async function getDb() {
    return open({ filename: DB_PATH, driver: sqlite3.Database });
}
