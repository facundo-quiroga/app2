import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("wellness.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    date TEXT,
    item_id TEXT,
    type TEXT, -- 'nutrition' or 'activity'
    completed INTEGER DEFAULT 0,
    UNIQUE(date, item_id, type)
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/progress/:date", (req, res) => {
    const { date } = req.params;
    const rows = db.prepare("SELECT item_id, type FROM progress WHERE date = ? AND completed = 1").all(date);
    res.json(rows);
  });

  app.post("/api/progress", (req, res) => {
    const { date, item_id, type, completed } = req.body;
    const id = `${date}_${type}_${item_id}`;
    
    if (completed) {
      db.prepare(`
        INSERT INTO progress (id, date, item_id, type, completed)
        VALUES (?, ?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET completed = 1
      `).run(id, date, item_id, type);
    } else {
      db.prepare("DELETE FROM progress WHERE id = ?").run(id);
    }
    
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
