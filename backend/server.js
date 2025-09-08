import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5001;

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount Decimal(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("initialized sucessfully.")

    } catch (error) {
        console.log("Error initializing DB :", error)
        process.exit(1);
    }
}


app.get('/api/transactions/:userId', async (req, res) => {
    try {

        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter" });
        }

        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.status(200).json(transactions);

    } catch (error) {
        console.log("Error getting transaction :", error)
        res.status(500).json({ error: "Internal server error" });
    }
});


app.delete('/api/transactions/:id', async (req, res) => {
    try {
        
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Missing id parameter" });
        }

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid id parameter" });
        }

        const deletedTransaction = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
        res.status(200).json({ message: "Transaction deleted successfully", transaction: deletedTransaction });

    } catch (error) {
        console.log("Error deleting transaction :", error)
        res.status(500).json({ error: "Internal server error" });
    }
})

app.post('/api/transactions', async (req, res) => {
    try {
        const { title, amount, category, user_id } = req.body;

        if (!title || !amount || !category || !user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const transaction = await sql`INSERT INTO transactions (title, amount, category, user_id) VALUES (${title}, ${amount}, ${category}, ${user_id}) RETURNING *`;

        console.log(transaction);
        res.status(201).json({ message: "Transaction created successfully" });

    } catch (error) {
        console.log("Error creating transaction :", error)
        res.status(500).json({ error: "Internal server error" });
    }
});

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
})

