import express from 'express';
import { createTransaction, deleteTransaction, getSummary, getTransactionByUserId } from '../controllers/transactionControllers.js';

const router = express.Router();

router.get('/:userId', getTransactionByUserId);


router.delete('/:id', deleteTransaction)

router.post('/', createTransaction);

router.get('/summary/:userId', getSummary);

export default router;