import fs from "fs";
import path from "path";
import {chromium, Page} from "playwright";
import sqlite3 from "sqlite3";
import {open} from "sqlite";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://remoteok.com/remote-jobs";

const DB_PATH = path.resolve(__dirname, "../../server/data/jobs.db");

async function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});

    const db = await open({filename: DB_PATH, driver: sqlite3.Database});
    await db.exec(`
        CREATE TABLE IF NOT EXISTS jobs
        (
            id
            INTEGER
            PRIMARY
            KEY,
            url
            TEXT
            UNIQUE,
            title
            TEXT,
            company
            TEXT,
            location
            TEXT,
            date
            TEXT,
            summary
            TEXT,
            tags
            TEXT,
            source
            TEXT,
            created_at
            TEXT
        );
    `);
    return db;
}

async function extractData(page: Page) {
    const rows = page.locator("table#jobsboard tr.job");
    const count = await rows.count();

    console.log(`Found ${count} jobs`);
    console.log(`Extracting job data...`);

    const jobs = [];
    for (let i = 0; i < count; i++) {
        const row = rows.nth(i);

        const title = await row.locator("td.position h2, a h2").innerText().catch(() => "");

        const company = await row
            .locator("td.company h3, .company h3, .companyLink h3")
            .innerText()
            .catch(() => "");

        const location = await row.locator("td.company div.location").first().innerText().catch(() => "");

        const date = await row.locator("time").getAttribute("datetime").catch(() => "");

        const link =
            (await row
                .locator('td.company a')
                .getAttribute("href")
                .catch(() => "")) || "";

        const tags = await row
            .locator(".tags .tag")
            .allInnerTexts()
            .then((arr) => arr.map((t) => t.trim()));

        jobs.push({
            title,
            company,
            location: location.includes("$") ? '🌏 Probably worldwide' : location,
            date,
            tags,
            link: link ? new URL(link, "https://remoteok.com").toString() : "",
        });
        console.log(`Extracted job data.${title}`);
    }
    return jobs;
}

async function insertJobsBulk(db: any, jobs: any[]) {
    if (!jobs.length) return;

    const placeholders = jobs.map(() =>
        "(?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).join(", ");

    const sql = `
        INSERT
        OR IGNORE INTO jobs
    (url, title, company, location, date, summary, tags, source, created_at)
    VALUES
        ${placeholders}
    `;

    const params = jobs.flatMap(job => [
        job.url,
        job.title,
        job.company || "",
        job.location || "",
        job.date || "",
        job.summary || "",
        Array.isArray(job.tags) ? job.tags.join(", ") : (job.tags || ""),
        job.source || "crawler",
        new Date().toISOString(),
    ]);

    await db.run(sql, params);
}


async function crawl() {
    const db = await ensureDb();
    const browser = await chromium.launch({headless: true});
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    console.log("Starting crawl ->", BASE_URL);

    // Delete previously scrapped records to prevent duplicates
    db.run('DELETE FROM jobs');

    await page.goto("https://remoteok.com/", {waitUntil: "domcontentloaded"});
    await page.waitForSelector("table#jobsboard tr.job");

    let lastHeight = 0;
    let jobs = [];
    while (true) {
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight);");
        await page.waitForTimeout(2000)

        const newHeight = await page.evaluate("document.body.scrollHeight") as number;
        if (newHeight === lastHeight) {
            jobs = await extractData(page);
            break;
        }
        lastHeight = newHeight;
    }

    insertJobsBulk(db, jobs);

    console.log("Crawl completed.");
    await browser.close();
    await db.close();
}

crawl().catch((e) => {
    console.error("Crawler error", e);
    process.exit(1);
});
