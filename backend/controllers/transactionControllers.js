import { sql } from '../config/db.js';

export async function getTransactionByUserId(req, res) {
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
}

export async function createTransaction(req, res) {
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
}

export async function getSummary(req, res) {
    try {
        
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter" });
        }

        const balance = await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}`;
        const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`;
        const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;

        res.status(200).json({
            balance: balance[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        });

    } catch (error) {
        console.log("Error creating transaction :", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteTransaction(req, res) {
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
}