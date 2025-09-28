import { Router } from "express";
import { getDb } from "../db";

const router = Router();

router.get("/", async (req, res) => {
    const db = await getDb();
    const q = String(req.query.q || "").trim();
    const location = String(req.query.location || "").trim();
    const company = String(req.query.company || "").trim();
    const category = String(req.query.category|| "all").trim();
    const sort = String(req.query.sort || "date");
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const filters: string[] = [];
    const params: any[] = [];

    if (q) { filters.push("(title LIKE ? OR summary LIKE ? OR company LIKE ?)"); params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
    if (location) { filters.push("location LIKE ?"); params.push(`%${location}%`); }
    if (company) { filters.push("company LIKE ?"); params.push(`%${company}%`); }
    if (category !== "all") { filters.push("tags LIKE ?"); params.push(`%${category}%`); }

    const where = filters.length ? "WHERE " + filters.join(" AND ") : "";
    let orderBy = "ORDER BY datetime(created_at) DESC";
    if (sort === "title") orderBy = "ORDER BY title COLLATE NOCASE ASC";

    const totalRow = await db.get(`SELECT COUNT(*) as cnt FROM jobs ${where}`, params);
    const total = totalRow?.cnt || 0;

    const rows = await db.all(
        `SELECT id, title, company, location, date, summary, tags, url, source, created_at
     FROM jobs ${where} ${orderBy} LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    res.json({ meta: { total, page, limit, pages: Math.ceil(total / limit) }, data: rows });
});

router.get("/:id", async (req, res) => {
    const db = await getDb();
    const row = await db.get("SELECT * FROM jobs WHERE id = ?", req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
});

export default router;
