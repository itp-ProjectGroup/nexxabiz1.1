import express from 'express';
import { getReturns, getReturnByID, createReturn } from '../controllers/returnController.js';

const router = express.Router();

// GET /returns
router.get('/', getReturns);

// GET /returns/:id
router.get('/:id', getReturnByID);

// POST /returns
router.post('/', createReturn);

export default router;