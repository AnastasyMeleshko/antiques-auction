import express from "express";
import { poolPromise } from "../db.js";

const router = express.Router();

// GET все антиквариаты
router.get("/antiques", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Antiques");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST создать антиквариат
router.post("/antiques", async (req, res) => {
    try {
        const { title, category, description, starting_price } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input("title", title)
            .input("category", category)
            .input("description", description)
            .input("starting_price", starting_price)
            .query("INSERT INTO Antiques (title, category, description, starting_price) VALUES (@title, @category, @description, @starting_price)");
        res.json({ message: "Antique created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT обновить антиквариат
router.put("/antiques/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, starting_price } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", id)
            .input("title", title)
            .input("category", category)
            .input("description", description)
            .input("starting_price", starting_price)
            .query("UPDATE Antiques SET title=@title, category=@category, description=@description, starting_price=@starting_price WHERE id=@id");

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Antique not found" });
        } else {
            res.json({ message: "Antique updated" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE антиквариат
router.delete("/antiques/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", id)
            .query("DELETE FROM Antiques WHERE id=@id");

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Antique not found" });
        } else {
            res.json({ message: "Antique deleted" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
