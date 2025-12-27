import express from "express";
import { poolPromise } from "../db.js";

const router = express.Router();

// GET all users
router.get("/users", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM [User]");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create user
router.post("/users", async (req, res) => {
    try {
        const { email, name } = req.body;
        const pool = await poolPromise;

        await pool.request()
            .input("email", email)
            .input("name", name)
            .query(`
                INSERT INTO [User] (email, name)
                VALUES (@email, @name)
            `);

        res.json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update user
router.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name } = req.body;

        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", id)
            .input("email", email)
            .input("name", name)
            .query(`
                UPDATE [User]
                SET email=@email, name=@name
                WHERE userId=@id
            `);

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json({ message: "User updated" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", id)
            .query("DELETE FROM [User] WHERE userId=@id");

        if (result.rowsAffected[0] === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json({ message: "User deleted" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
