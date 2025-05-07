import express from 'express';
import { getReturns, getReturnByID } from '../controllers/returnController.js';

const router = express.Router();

// GET /returns
router.get('/', getReturns);

// GET /returns/:id
router.get('/:id', getReturnByID);

export default router;
